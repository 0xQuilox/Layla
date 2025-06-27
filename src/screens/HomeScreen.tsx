
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: width * 0.05,
      minHeight: height,
    },
    header: {
      alignItems: 'center',
      marginTop: height * 0.05,
      marginBottom: height * 0.05,
    },
    themeToggle: {
      position: 'absolute',
      top: height * 0.02,
      right: width * 0.05,
      backgroundColor: colors.surface,
      borderRadius: 25,
      padding: 12,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    title: {
      fontSize: Math.min(width * 0.12, 48),
      fontWeight: 'bold',
      color: colors.primary,
      marginTop: 20,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: Math.min(width * 0.045, 18),
      color: colors.text,
      textAlign: 'center',
      marginTop: 10,
      opacity: 0.9,
      paddingHorizontal: width * 0.05,
    },
    buttonContainer: {
      gap: height * 0.025,
      marginBottom: height * 0.05,
      paddingHorizontal: width * 0.02,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      padding: height * 0.025,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      minHeight: 60,
    },
    primaryButtonText: {
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: 'bold',
      color: isDarkMode ? '#333333' : '#FFFFFF',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      padding: height * 0.025,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.secondary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      minHeight: 60,
    },
    secondaryButtonText: {
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: 'bold',
      color: colors.secondary,
    },
    infoContainer: {
      backgroundColor: colors.surface,
      padding: width * 0.05,
      borderRadius: 20,
      gap: 10,
      marginHorizontal: width * 0.02,
    },
    infoText: {
      fontSize: Math.min(width * 0.04, 16),
      color: colors.text,
      opacity: 0.9,
      lineHeight: 24,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginVertical: 8,
    },
    featureText: {
      flex: 1,
      fontSize: Math.min(width * 0.04, 16),
      color: colors.text,
      opacity: 0.8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
        <Ionicons 
          name={isDarkMode ? "sunny" : "moon"} 
          size={24} 
          color={colors.primary} 
        />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="hardware-chip" size={Math.min(width * 0.2, 80)} color={colors.primary} />
          <Text style={styles.title}>Layla</Text>
          <Text style={styles.subtitle}>
            Your AI-powered tech support assistant
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Diagnosis')}
            activeOpacity={0.8}
          >
            <Ionicons name="medical" size={24} color={isDarkMode ? '#333333' : '#FFFFFF'} />
            <Text style={styles.primaryButtonText}>Diagnose Tech Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Predictive')}
            activeOpacity={0.8}
          >
            <Ionicons name="analytics" size={24} color={colors.secondary} />
            <Text style={styles.secondaryButtonText}>Device Health Check</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { fontWeight: 'bold', fontSize: Math.min(width * 0.05, 20), color: colors.primary }]}>
            Features
          </Text>
          
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.featureText}>
              AI-powered diagnostic tools for quick issue resolution
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.featureText}>
              Predictive health monitoring for your devices
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.featureText}>
              Real-time device metrics and performance insights
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.featureText}>
              Personalized recommendations and solutions
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
