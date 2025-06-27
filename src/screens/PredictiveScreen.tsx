
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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import { useTheme } from '../context/ThemeContext';
import { collectDeviceMetrics, predictDeviceHealth } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function PredictiveScreen() {
  const { colors } = useTheme();
  const [deviceMetrics, setDeviceMetrics] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collecting, setCollecting] = useState(false);

  const collectMetrics = async () => {
    setCollecting(true);
    try {
      const batteryLevel = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();
      const powerState = await Battery.getPowerStateAsync();
      
      const metrics = {
        device_type: Device.deviceType?.toString() || 'unknown',
        device_name: Device.deviceName || 'Unknown Device',
        os_name: Device.osName || 'Unknown OS',
        os_version: Device.osVersion || 'Unknown Version',
        battery_level: Math.round(batteryLevel * 100),
        battery_state: batteryState,
        is_charging: powerState.batteryState === Battery.BatteryState.CHARGING,
        total_memory: Device.totalMemory || 0,
        brand: Device.brand || 'Unknown',
        model_name: Device.modelName || 'Unknown Model',
      };

      setDeviceMetrics(metrics);
      
      const result = await collectDeviceMetrics(metrics);
      Alert.alert('Success', 'Device metrics collected successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to collect device metrics. Please try again.');
      console.error('Metrics collection error:', error);
    } finally {
      setCollecting(false);
    }
  };

  const predictHealth = async () => {
    if (!deviceMetrics) {
      Alert.alert('Error', 'Please collect device metrics first.');
      return;
    }

    setLoading(true);
    try {
      const result = await predictDeviceHealth(deviceMetrics);
      setPrediction(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to predict device health. Please try again.');
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBatteryIcon = () => {
    if (!deviceMetrics) return 'battery-half';
    const level = deviceMetrics.battery_level;
    if (level > 75) return 'battery-full';
    if (level > 50) return 'battery-half';
    if (level > 25) return 'battery-dead';
    return 'battery-dead';
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: width * 0.05,
    },
    metricsContainer: {
      backgroundColor: colors.surface,
      padding: width * 0.05,
      borderRadius: 20,
      marginBottom: height * 0.025,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    sectionTitle: {
      fontSize: Math.min(width * 0.05, 20),
      fontWeight: 'bold',
      color: colors.primary,
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
      backgroundColor: colors.background,
      padding: 15,
      borderRadius: 15,
      alignItems: 'center',
      width: width < 400 ? '100%' : '48%',
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    metricLabel: {
      fontSize: Math.min(width * 0.035, 14),
      color: colors.text,
      marginTop: 5,
      opacity: 0.8,
      textAlign: 'center',
    },
    metricValue: {
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 5,
      textAlign: 'center',
    },
    collectButton: {
      backgroundColor: colors.secondary,
      padding: 18,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    collectButtonDisabled: {
      opacity: 0.7,
    },
    collectButtonText: {
      fontSize: Math.min(width * 0.04, 16),
      fontWeight: 'bold',
      color: '#333333',
    },
    predictionContainer: {
      backgroundColor: colors.surface,
      padding: width * 0.05,
      borderRadius: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    predictionResults: {
      marginBottom: 20,
    },
    healthScore: {
      alignItems: 'center',
      marginBottom: 20,
      padding: 20,
      backgroundColor: colors.background,
      borderRadius: 15,
    },
    scoreNumber: {
      fontSize: Math.min(width * 0.12, 48),
      fontWeight: 'bold',
      marginBottom: 10,
    },
    scoreLabel: {
      fontSize: Math.min(width * 0.04, 16),
      color: colors.text,
      opacity: 0.8,
    },
    predictButton: {
      backgroundColor: colors.primary,
      padding: 18,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    predictButtonText: {
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: 'bold',
      color: '#333333',
    },
    recommendationItem: {
      backgroundColor: colors.background,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    recommendationText: {
      flex: 1,
      fontSize: Math.min(width * 0.04, 16),
      color: colors.text,
      lineHeight: 22,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Device Metrics</Text>
          
          {deviceMetrics ? (
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Ionicons name="phone-portrait" size={30} color={colors.primary} />
                <Text style={styles.metricValue}>{deviceMetrics.device_name}</Text>
                <Text style={styles.metricLabel}>Device</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Ionicons name={getBatteryIcon()} size={30} color={colors.primary} />
                <Text style={styles.metricValue}>{deviceMetrics.battery_level}%</Text>
                <Text style={styles.metricLabel}>Battery Level</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Ionicons name="hardware-chip" size={30} color={colors.primary} />
                <Text style={styles.metricValue}>{deviceMetrics.os_name}</Text>
                <Text style={styles.metricLabel}>Operating System</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Ionicons name="build" size={30} color={colors.primary} />
                <Text style={styles.metricValue}>{deviceMetrics.brand}</Text>
                <Text style={styles.metricLabel}>Brand</Text>
              </View>
            </View>
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}

          <TouchableOpacity
            style={[
              styles.collectButton,
              collecting && styles.collectButtonDisabled,
            ]}
            onPress={collectMetrics}
            disabled={collecting}
            activeOpacity={0.8}
          >
            {collecting ? (
              <ActivityIndicator size="small" color="#333333" />
            ) : (
              <Ionicons name="refresh" size={24} color="#333333" />
            )}
            <Text style={styles.collectButtonText}>
              {collecting ? 'Collecting...' : 'Collect Metrics'}
            </Text>
          </TouchableOpacity>
        </View>

        {deviceMetrics && (
          <View style={styles.predictionContainer}>
            <Text style={styles.sectionTitle}>Health Prediction</Text>
            
            <TouchableOpacity
              style={styles.predictButton}
              onPress={predictHealth}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#333333" />
              ) : (
                <Ionicons name="analytics" size={24} color="#333333" />
              )}
              <Text style={styles.predictButtonText}>
                {loading ? 'Analyzing...' : 'Predict Health'}
              </Text>
            </TouchableOpacity>

            {prediction && !loading && (
              <View style={styles.predictionResults}>
                <View style={styles.healthScore}>
                  <Text 
                    style={[
                      styles.scoreNumber, 
                      { color: getHealthColor(prediction.health_score) }
                    ]}
                  >
                    {prediction.health_score}
                  </Text>
                  <Text style={styles.scoreLabel}>Health Score</Text>
                </View>

                {prediction.recommendations && prediction.recommendations.map((rec: string, index: number) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
