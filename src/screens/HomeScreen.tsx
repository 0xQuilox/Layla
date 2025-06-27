
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="hardware-chip" size={80} color="#FFD700" />
          <Text style={styles.title}>Layla</Text>
          <Text style={styles.subtitle}>
            Your AI-powered tech support assistant
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Diagnosis')}
          >
            <Ionicons name="medical" size={24} color="#333333" />
            <Text style={styles.primaryButtonText}>Diagnose Tech Issue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Predictive')}
          >
            <Ionicons name="analytics" size={24} color="#FFD700" />
            <Text style={styles.secondaryButtonText}>Device Health Check</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            • Get AI-powered solutions for your tech problems
          </Text>
          <Text style={styles.infoText}>
            • Predict potential device issues before they happen
          </Text>
          <Text style={styles.infoText}>
            • Monitor your device's health in real-time
          </Text>
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
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#7DF9FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7DF9FF',
  },
  infoContainer: {
    backgroundColor: '#444444',
    padding: 20,
    borderRadius: 15,
    gap: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});
