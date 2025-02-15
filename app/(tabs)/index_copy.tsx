import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Text, Image, StyleSheet, Platform, ScrollView, View, Button, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import axios from 'axios';


export default function HomeScreen() {
  // Define state for logs
  const [logs, setLogs] = useState<string[]>([]);

  // Function to handle the "Run Backtest" button click
  const handleRunBacktest = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/run_backtest');
      console.log('Backtest triggered:', response.data);
    } catch (error) {
      console.error('Error triggering backtest:', error);
    }
  };  

  // Function to fetch logs from the backend
  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/get-logs');
      if (response.data.new_lines) {
        setLogs((prevLogs) => [...prevLogs, ...response.data.new_lines]);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  // Use useEffect to fetch logs every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs();
    }, 2000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

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
        <Button
          title="Run Backtest"
          onPress={handleRunBacktest}
          color="#007bff"
        />
        {/* Logs Section */}
        <ThemedText type="title">Logs:</ThemedText>
        <ScrollView style={styles.logContainer}>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>
              {log}
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
    alignItems: 'center',
    gap: 8,
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
  },
});
