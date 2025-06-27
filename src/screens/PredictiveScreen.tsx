
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { collectDeviceMetrics, predictDeviceHealth } from '../services/api';

export default function PredictiveScreen() {
  const [deviceMetrics, setDeviceMetrics] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collecting, setCollecting] = useState(false);

  const collectMetrics = async () => {
    setCollecting(true);
    try {
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();
      const isLowPowerMode = await Battery.isLowPowerModeEnabledAsync();
      
      const metrics = {
        batteryLevel: Math.round(batteryLevel * 100),
        batteryState: batteryState,
        isLowPowerMode: isLowPowerMode,
        deviceType: Device.deviceType,
        deviceName: Device.deviceName,
        osVersion: Device.osVersion,
        platform: Device.osName,
        totalMemory: Device.totalMemory,
        // Simulated metrics for demo purposes
        cpuUsage: Math.round(Math.random() * 100),
        storageUsage: Math.round(Math.random() * 100),
        temperature: Math.round(25 + Math.random() * 20), // 25-45°C
        networkLatency: Math.round(10 + Math.random() * 200), // 10-210ms
      };

      setDeviceMetrics(metrics);
    } catch (error) {
      Alert.alert('Error', 'Failed to collect device metrics.');
    } finally {
      setCollecting(false);
    }
  };

  const runPrediction = async () => {
    if (!deviceMetrics) {
      Alert.alert('No Data', 'Please collect device metrics first.');
      return;
    }

    setLoading(true);
    try {
      const result = await predictDeviceHealth(deviceMetrics);
      setPrediction(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to predict device health. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    collectMetrics();
  }, []);

  const getHealthColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Green
    if (score >= 60) return '#FFD700'; // Yellow
    if (score >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getHealthStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Device Metrics</Text>
          
          {deviceMetrics ? (
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="battery-half" size={24} color="#FFD700" />
                <Text style={styles.metricLabel}>Battery</Text>
                <Text style={styles.metricValue}>{deviceMetrics.batteryLevel}%</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Ionicons name="speedometer" size={24} color="#7DF9FF" />
                <Text style={styles.metricLabel}>CPU Usage</Text>
                <Text style={styles.metricValue}>{deviceMetrics.cpuUsage}%</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Ionicons name="save" size={24} color="#FF9800" />
                <Text style={styles.metricLabel}>Storage</Text>
                <Text style={styles.metricValue}>{deviceMetrics.storageUsage}%</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Ionicons name="thermometer" size={24} color="#F44336" />
                <Text style={styles.metricLabel}>Temperature</Text>
                <Text style={styles.metricValue}>{deviceMetrics.temperature}°C</Text>
              </View>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#FFD700" />
          )}

          <TouchableOpacity
            style={[styles.collectButton, collecting && styles.collectButtonDisabled]}
            onPress={collectMetrics}
            disabled={collecting}
          >
            {collecting ? (
              <ActivityIndicator size="small" color="#333333" />
            ) : (
              <Ionicons name="refresh" size={24} color="#333333" />
            )}
            <Text style={styles.collectButtonText}>
              {collecting ? 'Collecting...' : 'Refresh Metrics'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.predictionContainer}>
          <Text style={styles.sectionTitle}>Health Prediction</Text>
          
          {prediction ? (
            <View style={styles.predictionResults}>
              <View style={styles.healthScore}>
                <Text style={styles.healthScoreLabel}>Overall Health Score</Text>
                <Text style={[styles.healthScoreValue, { color: getHealthColor(prediction.healthScore) }]}>
                  {prediction.healthScore}/100
                </Text>
                <Text style={[styles.healthStatus, { color: getHealthColor(prediction.healthScore) }]}>
                  {getHealthStatus(prediction.healthScore)}
                </Text>
              </View>

              <View style={styles.risksContainer}>
                <Text style={styles.risksTitle}>Potential Risks</Text>
                {prediction.risks.map((risk, index) => (
                  <View key={index} style={styles.riskItem}>
                    <Ionicons name="warning" size={16} color="#FFD700" />
                    <Text style={styles.riskText}>{risk}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsTitle}>Recommendations</Text>
                {prediction.recommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>Run prediction to see device health analysis</Text>
          )}

          <TouchableOpacity
            style={[styles.predictButton, loading && styles.predictButtonDisabled]}
            onPress={runPrediction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#333333" />
            ) : (
              <Ionicons name="analytics" size={24} color="#333333" />
            )}
            <Text style={styles.predictButtonText}>
              {loading ? 'Predicting...' : 'Run Health Prediction'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  metricsContainer: {
    backgroundColor: '#444444',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#555555',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    opacity: 0.8,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
  },
  collectButton: {
    backgroundColor: '#7DF9FF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  collectButtonDisabled: {
    opacity: 0.7,
  },
  collectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  predictionContainer: {
    backgroundColor: '#444444',
    padding: 20,
    borderRadius: 15,
  },
  predictionResults: {
    marginBottom: 20,
  },
  healthScore: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#555555',
    borderRadius: 10,
  },
  healthScoreLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  healthScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  healthStatus: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  risksContainer: {
    marginBottom: 20,
  },
  risksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  riskText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  recommendationsContainer: {
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7DF9FF',
    marginBottom: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20,
  },
  predictButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  predictButtonDisabled: {
    opacity: 0.7,
  },
  predictButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});
