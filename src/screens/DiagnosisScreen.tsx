
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { diagnoseTechIssue } from '../services/api';

const deviceTypes = [
  { label: 'Select device type...', value: '' },
  { label: 'Smartphone', value: 'smartphone' },
  { label: 'Laptop', value: 'laptop' },
  { label: 'Tablet', value: 'tablet' },
  { label: 'Desktop PC', value: 'desktop' },
  { label: 'Smartwatch', value: 'smartwatch' },
  { label: 'Smart TV', value: 'tv' },
  { label: 'Router/Modem', value: 'router' },
  { label: 'Printer', value: 'printer' },
  { label: 'Gaming Console', value: 'console' },
  { label: 'Other Device', value: 'other' },
];

export default function DiagnosisScreen() {
  const [deviceType, setDeviceType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async () => {
    if (!deviceType || !issueDescription.trim()) {
      Alert.alert('Missing Information', 'Please select a device type and describe your issue.');
      return;
    }

    setLoading(true);
    try {
      const result = await diagnoseTechIssue({
        deviceType,
        issueDescription: issueDescription.trim(),
      });
      setDiagnosis(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to diagnose the issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Device Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={deviceType}
              onValueChange={setDeviceType}
              style={styles.picker}
              dropdownIconColor="#FFD700"
            >
              {deviceTypes.map((device) => (
                <Picker.Item
                  key={device.value}
                  label={device.label}
                  value={device.value}
                  color="#333333"
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.sectionTitle}>Issue Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your tech issue in detail..."
            placeholderTextColor="#999999"
            value={issueDescription}
            onChangeText={setIssueDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.diagnoseButton, loading && styles.diagnoseButtonDisabled]}
            onPress={handleDiagnose}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#333333" />
            ) : (
              <Ionicons name="medical" size={24} color="#333333" />
            )}
            <Text style={styles.diagnoseButtonText}>
              {loading ? 'Diagnosing...' : 'Diagnose Issue'}
            </Text>
          </TouchableOpacity>
        </View>

        {diagnosis && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Diagnosis Results</Text>
            
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                <Ionicons name="warning" size={16} color="#FFD700" /> Possible Causes
              </Text>
              {diagnosis.possibleCauses.map((cause, index) => (
                <Text key={index} style={styles.resultItem}>
                  • {cause}
                </Text>
              ))}
            </View>

            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>
                <Ionicons name="build" size={16} color="#7DF9FF" /> Suggested Solutions
              </Text>
              {diagnosis.suggestedSolutions.map((solution, index) => (
                <Text key={index} style={styles.resultItem}>
                  {index + 1}. {solution}
                </Text>
              ))}
            </View>
          </View>
        )}
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
  formContainer: {
    backgroundColor: '#444444',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    color: '#333333',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    marginBottom: 20,
    minHeight: 120,
  },
  diagnoseButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  diagnoseButtonDisabled: {
    opacity: 0.7,
  },
  diagnoseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  resultsContainer: {
    backgroundColor: '#444444',
    padding: 20,
    borderRadius: 15,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: 20,
  },
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.9,
  },
});
