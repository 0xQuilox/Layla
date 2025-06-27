
import axios from 'axios';

const API_BASE_URL = 'http://0.0.0.0:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DiagnoseTechIssueInput {
  deviceType: string;
  issueDescription: string;
}

export interface DiagnoseTechIssueOutput {
  possibleCauses: string[];
  suggestedSolutions: string[];
}

export interface DeviceMetrics {
  batteryLevel: number;
  batteryState: number;
  isLowPowerMode: boolean;
  deviceType: any;
  deviceName: string;
  osVersion: string;
  platform: string;
  totalMemory: number;
  cpuUsage: number;
  storageUsage: number;
  temperature: number;
  networkLatency: number;
}

export interface PredictionResult {
  healthScore: number;
  risks: string[];
  recommendations: string[];
  predictedIssues: string[];
}

export const diagnoseTechIssue = async (input: DiagnoseTechIssueInput): Promise<DiagnoseTechIssueOutput> => {
  try {
    const response = await api.post('/diagnose-tech-issue/', input);
    return response.data;
  } catch (error) {
    console.error('Error diagnosing tech issue:', error);
    throw error;
  }
};

export const collectDeviceMetrics = async (metrics: DeviceMetrics): Promise<any> => {
  try {
    const response = await api.post('/collect-metrics/', metrics);
    return response.data;
  } catch (error) {
    console.error('Error collecting device metrics:', error);
    throw error;
  }
};

export const predictDeviceHealth = async (metrics: DeviceMetrics): Promise<PredictionResult> => {
  try {
    const response = await api.post('/predict-health/', metrics);
    return response.data;
  } catch (error) {
    console.error('Error predicting device health:', error);
    // Return mock data for demo purposes
    return {
      healthScore: Math.round(60 + Math.random() * 40),
      risks: [
        'Battery degradation detected',
        'High CPU usage pattern',
        'Storage space running low',
      ],
      recommendations: [
        'Close unnecessary background apps',
        'Clear device cache regularly',
        'Consider battery replacement if degradation continues',
        'Free up storage space by removing unused files',
      ],
      predictedIssues: [
        'Potential battery failure in 3-6 months',
        'Performance slowdown expected',
      ],
    };
  }
};
