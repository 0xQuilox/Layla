
from django.db import models
from django.utils import timezone

class DeviceMetrics(models.Model):
    battery_level = models.FloatField()
    cpu_usage = models.FloatField()
    storage_usage = models.FloatField()
    temperature = models.FloatField()
    network_latency = models.FloatField()
    device_type = models.CharField(max_length=50)
    os_version = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'device_metrics'

class HealthPrediction(models.Model):
    battery_level = models.FloatField()
    cpu_usage = models.FloatField()
    storage_usage = models.FloatField()
    temperature = models.FloatField()
    network_latency = models.FloatField()
    health_score = models.FloatField()
    predicted_issues = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'health_predictions'
