import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Image, StyleSheet, Platform } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

import { View, Button, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const socket = io("http://127.0.0.1:5000", {
    transports: ["websocket"],  // Force WebSocket transport
  });

  useEffect(() => {
    // Listen for incoming log messages
    socket.on('log', (log: string) => {
      setLogs((prevLogs) => [...prevLogs, log]);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleRunBacktest = () => {
    socket.emit('run_backtest'); // Trigger the backend to start the backtest
  };

  return (
    <div>
      <button onClick={handleRunBacktest}>Run Backtest</button>
      <pre style={{ whiteSpace: "pre-wrap", backgroundColor: "#f0f0f0", padding: "1em", maxHeight: "400px", overflowY: "scroll" }}>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </pre>
    </div>
  );
};

export default App;



const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
