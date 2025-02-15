import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Text, Image, StyleSheet, ScrollView, Button, View } from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { BacktestForm } from '@/components/BacktestForm';

// Variable to hold the polling interval
let logPollingInterval: any = null;

const API_BASE_URL = 'http://127.0.0.1:5000';

export default function HomeScreen() {
  // Define state for logs and config
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState({
    symbol: 'EURUSD=X',
    interval: '5m',
    confidence: 0.6,
    targetCandle: 12,
    profitPerc: 0.10,
    stopLossPerc: 0.05,
    gapBetweenTrades: 0,
    featureHorizons: [2, 8, 32, 128, 512],
    maxPositions: 15,
    longBias: 1.0,
    leverage: 100,
  });

  // Function to update config
  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Function to handle the "Run Backtest" button click
  const runBacktest = async () => {
    try {
      // Clear previous logs
      setLogs([]);

      // Send config to backend
      await fetch(`${API_BASE_URL}/run_backtest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config
        }),
      });

      startFetchingLogs();
    } catch (error) {
      console.error('Error running backtest:', error);
      setLogs(prev => [...prev, 'Error: Failed to start backtest']);
    }
  };

  const startFetchingLogs = () => {
    // Clear any existing interval to avoid multiple intervals
    clearInterval(logPollingInterval);

    // Poll the logs every 100ms
    logPollingInterval = setInterval(fetchLogs, 100);
  };

  const stopFetchingLogs = () => {
    // Clear the interval to stop fetching logs
    clearInterval(logPollingInterval);
    logPollingInterval = null;
  };

  // Function to fetch logs from the backend
  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-logs`);
      const data = await response.json();

      // Append new logs to the existing log list
      setLogs((prevLogs) => [...prevLogs, ...data.new_lines]);

      // Check if "Maximum Draw-down" is in the logs, and stop fetching if it is
      if (data.new_lines.some((line: string) => line.includes('Maximum Draw-down'))) {
        stopFetchingLogs();
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Backtest Trading Configuration</ThemedText>
        
        {/* Configuration Form */}
        <View style={styles.formContainer}>
          <BacktestForm config={config} onConfigChange={handleConfigChange} />
        </View>

        {/* "Run Backtest" Button */}
        <View style={styles.buttonContainer}>
          <Button title="Run Backtest" onPress={runBacktest} color="#007bff"/>
        </View>

        {/* Logs Section */}
        <View style={styles.logsSection}>
          <ThemedText type="title">Logs:</ThemedText>
          <ScrollView style={styles.logContainer}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log.replace(/\t/g, '    ')} 
              </Text>
            ))}
          </ScrollView>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  logsSection: {
    marginTop: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  logContainer: {
    maxHeight: 300,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  logText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontFamily: 'monospace'
  },
});