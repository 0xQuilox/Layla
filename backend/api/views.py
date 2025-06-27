
import json
import pickle
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import DeviceMetrics, HealthPrediction
from .ml_model import DeviceHealthPredictor

# Initialize the ML model
predictor = DeviceHealthPredictor()

@api_view(['POST'])
def diagnose_tech_issue(request):
    try:
        device_type = request.data.get('deviceType')
        issue_description = request.data.get('issueDescription')
        
        if not device_type or not issue_description:
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Simple rule-based diagnosis (replace with AI/ML model)
        possible_causes = []
        suggested_solutions = []
        
        issue_lower = issue_description.lower()
        
        # Battery related issues
        if 'battery' in issue_lower or 'charge' in issue_lower or 'power' in issue_lower:
            possible_causes.extend([
                'Battery degradation due to age',
                'Faulty charging cable or adapter',
                'Background apps consuming excessive power',
                'Software bugs causing power drain'
            ])
            suggested_solutions.extend([
                'Try a different charging cable and adapter',
                'Close unnecessary background applications',
                'Check for software updates',
                'Consider battery replacement if device is old'
            ])
        
        # Performance issues
        if any(word in issue_lower for word in ['slow', 'lag', 'freeze', 'performance']):
            possible_causes.extend([
                'Insufficient storage space',
                'Too many background processes',
                'Outdated software',
                'Hardware thermal throttling'
            ])
            suggested_solutions.extend([
                'Free up storage space by deleting unused files',
                'Restart the device to clear memory',
                'Update to the latest software version',
                'Check for malware or unnecessary apps'
            ])
        
        # Screen issues
        if any(word in issue_lower for word in ['screen', 'display', 'flicker']):
            possible_causes.extend([
                'Loose display cable connection',
                'Graphics driver issues',
                'Hardware display panel failure',
                'Software display settings conflict'
            ])
            suggested_solutions.extend([
                'Update graphics drivers',
                'Adjust display settings and refresh rate',
                'Run hardware diagnostics',
                'Contact manufacturer if under warranty'
            ])
        
        # Default fallback
        if not possible_causes:
            possible_causes = [
                'Software configuration issue',
                'Hardware component malfunction',
                'Driver compatibility problem'
            ]
            suggested_solutions = [
                'Restart the device',
                'Check for software updates',
                'Contact technical support for further assistance'
            ]
        
        return Response({
            'possibleCauses': possible_causes[:4],  # Limit to 4 items
            'suggestedSolutions': suggested_solutions[:4]
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def collect_metrics(request):
    try:
        metrics_data = request.data
        
        # Save metrics to database
        device_metrics = DeviceMetrics.objects.create(
            battery_level=metrics_data.get('batteryLevel', 0),
            cpu_usage=metrics_data.get('cpuUsage', 0),
            storage_usage=metrics_data.get('storageUsage', 0),
            temperature=metrics_data.get('temperature', 25),
            network_latency=metrics_data.get('networkLatency', 50),
            device_type=metrics_data.get('deviceType', 'unknown'),
            os_version=metrics_data.get('osVersion', 'unknown')
        )
        
        return Response({
            'id': device_metrics.id,
            'message': 'Metrics collected successfully'
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def predict_health(request):
    try:
        metrics = request.data
        
        # Extract features for ML model
        features = [
            metrics.get('batteryLevel', 50),
            metrics.get('cpuUsage', 50),
            metrics.get('storageUsage', 50),
            metrics.get('temperature', 30),
            metrics.get('networkLatency', 50),
        ]
        
        # Get prediction from ML model
        prediction_result = predictor.predict_health(features)
        
        # Save prediction to database
        health_prediction = HealthPrediction.objects.create(
            battery_level=features[0],
            cpu_usage=features[1],
            storage_usage=features[2],
            temperature=features[3],
            network_latency=features[4],
            health_score=prediction_result['health_score'],
            predicted_issues=json.dumps(prediction_result['predicted_issues'])
        )
        
        return Response(prediction_result)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
