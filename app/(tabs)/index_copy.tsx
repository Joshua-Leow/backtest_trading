import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import React, {useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// Variable to hold the polling interval
let logPollingInterval: any = null;

const API_BASE_URL = 'http://127.0.0.1:5000';


export default function HomeScreen() {
  // Define state for logs
  const [logs, setLogs] = useState<string[]>([]);

  // Function to handle the "Run Backtest" button click
  const runBacktest = async () => {
    try {
      await fetch(`${API_BASE_URL}/run_backtest`);
      startFetchingLogs();
    } catch (error) {
      console.error('Error running backtest:', error);
    }
  };

  const startFetchingLogs = () => {
    // Clear any existing interval to avoid multiple intervals
    clearInterval(logPollingInterval);

    // Poll the logs every 2 seconds
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

  // // Use useEffect to fetch logs every 2 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchLogs();
  //   }, 2000);

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Backtest Trading!</ThemedText>
        <HelloWave />
        {/* "Run Backtest" Button */}
        <Button title="Run Backtest" onPress={runBacktest} color="#007bff"/>
        {/* Logs Section */}
        <ThemedText type="title">Logs:</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
      <ScrollView style={styles.logContainer}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log.replace(/\t/g, '    ')} 
            </Text>
          ))}
        </ScrollView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
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
