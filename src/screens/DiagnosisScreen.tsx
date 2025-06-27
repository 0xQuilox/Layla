
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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../context/ThemeContext';
import { diagnoseTechIssue } from '../services/api';

const { width, height } = Dimensions.get('window');

export default function DiagnosisScreen() {
  const { colors } = useTheme();
  const [deviceType, setDeviceType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnosis = async () => {
    if (!deviceType || !issueDescription.trim()) {
      Alert.alert('Error', 'Please select a device type and describe the issue.');
      return;
    }

    setLoading(true);
    try {
      const result = await diagnoseTechIssue({
        device_type: deviceType,
        issue_description: issueDescription,
      });
      setDiagnosis(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to diagnose the issue. Please try again.');
      console.error('Diagnosis error:', error);
    } finally {
      setLoading(false);
    }
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
    formContainer: {
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
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 15,
    },
    pickerContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      marginBottom: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    picker: {
      height: 50,
      color: '#333333',
    },
    textInput: {
      backgroundColor: '#FFFFFF',
      borderRadius: 15,
      padding: 15,
      fontSize: Math.min(width * 0.04, 16),
      color: '#333333',
      marginBottom: 20,
      minHeight: Math.min(height * 0.15, 120),
      textAlignVertical: 'top',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    diagnoseButton: {
      backgroundColor: colors.primary,
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
    diagnoseButtonDisabled: {
      opacity: 0.7,
    },
    diagnoseButtonText: {
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: 'bold',
      color: '#333333',
    },
    resultsContainer: {
      backgroundColor: colors.surface,
      padding: width * 0.05,
      borderRadius: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    resultsTitle: {
      fontSize: Math.min(width * 0.055, 22),
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 20,
      textAlign: 'center',
    },
    resultSection: {
      marginBottom: 20,
      backgroundColor: colors.background,
      padding: 15,
      borderRadius: 15,
    },
    resultSectionTitle: {
      fontSize: Math.min(width * 0.045, 18),
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    resultItem: {
      fontSize: Math.min(width * 0.04, 16),
      color: colors.text,
      marginBottom: 8,
      lineHeight: 22,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    loadingText: {
      marginTop: 15,
      fontSize: Math.min(width * 0.04, 16),
      color: colors.text,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Device Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={deviceType}
              style={styles.picker}
              onValueChange={(itemValue) => setDeviceType(itemValue)}
            >
              <Picker.Item label="Select device type..." value="" />
              <Picker.Item label="Laptop" value="laptop" />
              <Picker.Item label="Desktop" value="desktop" />
              <Picker.Item label="Smartphone" value="smartphone" />
              <Picker.Item label="Tablet" value="tablet" />
              <Picker.Item label="Smart TV" value="smart_tv" />
              <Picker.Item label="Gaming Console" value="gaming_console" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <Text style={styles.sectionTitle}>Issue Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe the technical issue you're experiencing..."
            placeholderTextColor="#999999"
            value={issueDescription}
            onChangeText={setIssueDescription}
            multiline
            numberOfLines={6}
          />

          <TouchableOpacity
            style={[
              styles.diagnoseButton,
              loading && styles.diagnoseButtonDisabled,
            ]}
            onPress={handleDiagnosis}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#333333" />
            ) : (
              <Ionicons name="search" size={24} color="#333333" />
            )}
            <Text style={styles.diagnoseButtonText}>
              {loading ? 'Analyzing...' : 'Diagnose Issue'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              AI is analyzing your issue...{'\n'}This may take a few moments.
            </Text>
          </View>
        )}

        {diagnosis && !loading && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Diagnosis Results</Text>
            
            {diagnosis.possible_causes && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Possible Causes</Text>
                {diagnosis.possible_causes.map((cause: string, index: number) => (
                  <Text key={index} style={styles.resultItem}>
                    • {cause}
                  </Text>
                ))}
              </View>
            )}

            {diagnosis.solutions && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Recommended Solutions</Text>
                {diagnosis.solutions.map((solution: string, index: number) => (
                  <Text key={index} style={styles.resultItem}>
                    {index + 1}. {solution}
                  </Text>
                ))}
              </View>
            )}

            {diagnosis.severity && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Issue Severity</Text>
                <Text style={styles.resultItem}>{diagnosis.severity}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
