import React from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';

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
  const handleFeatureHorizonsChange = (text: string) => {
    try {
      const horizons = text.split(',').map(num => parseInt(num.trim()));
      onConfigChange('featureHorizons', horizons);
    } catch (error) {
      console.error('Invalid feature horizons format');
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
        <TextInput
          style={styles.input}
          value={config.interval}
          onChangeText={(value) => onConfigChange('interval', value)}
          placeholder="5m"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Confidence (0-1)</ThemedText>
        <TextInput
          style={styles.input}
          value={config.confidence.toString()}
          onChangeText={(value) => onConfigChange('confidence', parseFloat(value))}
          keyboardType="decimal-pad"
          placeholder="0.6"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Target Candle</ThemedText>
        <TextInput
          style={styles.input}
          value={config.targetCandle.toString()}
          onChangeText={(value) => onConfigChange('targetCandle', parseInt(value))}
          keyboardType="number-pad"
          placeholder="12"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Profit Percentage</ThemedText>
        <TextInput
          style={styles.input}
          value={config.profitPerc.toString()}
          onChangeText={(value) => onConfigChange('profitPerc', parseFloat(value))}
          keyboardType="decimal-pad"
          placeholder="0.10"
        />
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Stop Loss Percentage</ThemedText>
        <TextInput
          style={styles.input}
          value={config.stopLossPerc.toString()}
          onChangeText={(value) => onConfigChange('profitPerc', parseFloat(value))}
          keyboardType="decimal-pad"
          placeholder="0.05"
        />
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
});