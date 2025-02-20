import React from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch, Text } from 'react-native';
import { ThemedText } from './ThemedText';
import Slider from '@react-native-community/slider';

interface BacktestFormProps {
  config: {
    symbol: string;
    interval: string;
    confidence: number;
    targetCandle: number;
    profitPerc: number;
    stopLossPerc: number;
    gapBetweenTrades: number;
    featureHorizons: number[];
    maxPositions: number;
    longBias: number;
    leverage: number;
  };
  onConfigChange: (key: string, value: any) => void;
}

export function BacktestForm({ config, onConfigChange }: BacktestFormProps) {
  const validIntervals = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'];
  const [isStopLossLinked, setIsStopLossLinked] = React.useState(false);
  const handleFeatureHorizonsChange = (text: string) => {
    try {
      const horizons = text.split(',').map(num => parseInt(num.trim()));
      onConfigChange('featureHorizons', horizons);
    } catch (error) {
      console.error('Invalid feature horizons format');
    }
  };

  const handleProfitPercChange = (value: string) => {
    const profitPerc = parseFloat(value);
    onConfigChange('profitPerc', profitPerc);

    // Update stop loss if linked
    if (isStopLossLinked) {
      onConfigChange('stopLossPerc', profitPerc * 0.5); // Set stop loss as 50% of profit percentage
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Symbol</ThemedText>
        <TextInput
          style={styles.input}
          value={config.symbol}
          onChangeText={(value) => onConfigChange('symbol', value)}
          placeholder="EURUSD=X"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Interval</ThemedText>
        <View style={styles.intervalButtons}>
          {validIntervals.map((interval) => (
            <TouchableOpacity
              key={interval}
              style={[
                styles.intervalButton,
                config.interval === interval && styles.selectedIntervalButton,
              ]}
              onPress={() => onConfigChange('interval', interval)}
            >
              <Text style={styles.intervalButtonText}>{interval}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Confidence ({Math.round(config.confidence * 100)}%)</ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={0.5}
          maximumValue={1}
          step={0.01}
          value={config.confidence}
          onValueChange={(value) => onConfigChange('confidence', value)}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007bff"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Target Candle ({config.targetCandle})</ThemedText>
        <TextInput
          style={styles.input}
          value={config.targetCandle.toString()}
          onChangeText={(value) => {
            const parsedValue = parseInt(value, 10);
            const newValue = isNaN(parsedValue) ? 0 : parsedValue;
            onConfigChange('targetCandle', newValue);
          }}
          keyboardType="number-pad"
          placeholder="240"
        />
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10000}
          step={1}
          value={config.targetCandle}
          onValueChange={(value) => {
            onConfigChange('targetCandle', value);
          }}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007bff"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Profit Percentage ({config.profitPerc}%)</ThemedText>
        <TextInput
          style={styles.input}
          value={config.profitPerc.toString()}
          onChangeText={(value) => {
            let parsedValue = parseFloat(value);
            const newValue = isNaN(parsedValue) ? 0 : parsedValue;
            onConfigChange('profitPerc', newValue);
            if (!isNaN(parsedValue)) {
              // Limit to 3 decimal places
              parsedValue = parseFloat(parsedValue.toFixed(3));
              onConfigChange('profitPerc', parsedValue);

              // Update stopLossPerc if switch is ON
              if (isStopLossLinked) {
                const multiplier = config.stopLossPerc / config.profitPerc;
                onConfigChange('stopLossPerc', parsedValue * multiplier);
              }
            }
          }}
          keyboardType="decimal-pad"
          placeholder="240"
          maxLength={6} // Ensures 3 digits before and up to 3 decimal places
        />
        <Slider
          style={styles.slider}
          minimumValue={0.001}
          maximumValue={10}
          step={0.001}
          value={config.profitPerc}
          onValueChange={(value) => {
            onConfigChange('profitPerc', parseFloat(value.toFixed(3)));
            
            // Update stopLossPerc if switch is ON
            if (isStopLossLinked) {
              const multiplier = config.stopLossPerc / config.profitPerc;
              onConfigChange('stopLossPerc', value * multiplier);
            }
          }}
          minimumTrackTintColor="#007bff"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007bff"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Stop Loss Percentage ({config.stopLossPerc.toFixed(3)}%)</ThemedText>
        <View style={styles.stopLossContainer}>
          <Switch
            value={isStopLossLinked}
            onValueChange={(value) => {
              setIsStopLossLinked(value);
              if (value) {
                const initialMultiplier = 0.5;
                onConfigChange('stopLossPerc', config.profitPerc * initialMultiplier);
              }
            }}
          />
          <Text style={styles.stopLossText}>Set Stop Loss Percentage as a Ratio of Profit Percentage</Text>
        </View>

        {isStopLossLinked ? (
          <>
            <View style={styles.linkedInputContainer}>
              <Text style={styles.linkedInputText}>Stop Loss Percentage = Profit Percentage x </Text>
              <TextInput
                style={[styles.input, styles.linkedInput]}
                value={(config.stopLossPerc / config.profitPerc).toFixed(3)}
                onChangeText={(value) => {
                  let parsedValue = parseFloat(value);
                  if (!isNaN(parsedValue)) {
                    parsedValue = parseFloat(parsedValue.toFixed(3));
                    onConfigChange('stopLossPerc', config.profitPerc * parsedValue);
                  }
                }}
                keyboardType="decimal-pad"
                placeholder="0.5"
                maxLength={6} // Limit to 3 decimal places
              />
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.001}
              maximumValue={2}
              step={0.001}
              value={config.stopLossPerc / config.profitPerc}
              onValueChange={(value) => {
                onConfigChange('stopLossPerc', parseFloat((config.profitPerc * value).toFixed(3)));
              }}
              minimumTrackTintColor="#007bff"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#007bff"
            />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={config.stopLossPerc.toString()}
              onChangeText={(value) => {
                let parsedValue = parseFloat(value);
                if (!isNaN(parsedValue)) {
                  parsedValue = parseFloat(parsedValue.toFixed(3));
                  onConfigChange('stopLossPerc', parsedValue);
                }
              }}
              keyboardType="decimal-pad"
              placeholder="0.05"
              maxLength={6} // Limit to 3 decimal places
            />
            <Slider
              style={styles.slider}
              minimumValue={0.001}
              maximumValue={10}
              step={0.001}
              value={config.stopLossPerc}
              onValueChange={(value) => {
                onConfigChange('stopLossPerc', parseFloat(value.toFixed(3)));
              }}
              minimumTrackTintColor="#007bff"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#007bff"
            />
          </>
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Gap Between Trades</ThemedText>
        <TextInput
          style={styles.input}
          value={config.gapBetweenTrades.toString()}
          onChangeText={(value) => onConfigChange('gapBetweenTrades', parseInt(value))}
          keyboardType="number-pad"
          placeholder="0"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Feature Horizons (comma-separated)</ThemedText>
        <TextInput
          style={styles.input}
          value={config.featureHorizons.join(', ')}
          onChangeText={handleFeatureHorizonsChange}
          placeholder="2, 8, 32, 128, 512"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Max Positions</ThemedText>
        <TextInput
          style={styles.input}
          value={config.maxPositions.toString()}
          onChangeText={(value) => onConfigChange('maxPositions', parseInt(value))}
          keyboardType="number-pad"
          placeholder="15"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Long Bias</ThemedText>
        <TextInput
          style={styles.input}
          value={config.longBias.toString()}
          onChangeText={(value) => onConfigChange('longBias', parseFloat(value))}
          keyboardType="decimal-pad"
          placeholder="1.0"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Leverage</ThemedText>
        <TextInput
          style={styles.input}
          value={config.leverage.toString()}
          onChangeText={(value) => onConfigChange('leverage', parseInt(value))}
          keyboardType="number-pad"
          placeholder="100"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  intervalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedIntervalButton: {
    backgroundColor: '#007bff',
  },
  intervalButtonText: {
    fontSize: 14,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  stopLossContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopLossText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  linkedInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  linkedInputText: {
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  linkedInput: {
    flex: 1,
  },
});