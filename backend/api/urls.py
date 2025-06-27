
from django.urls import path
from . import views

urlpatterns = [
    path('diagnose-tech-issue/', views.diagnose_tech_issue, name='diagnose_tech_issue'),
    path('collect-metrics/', views.collect_metrics, name='collect_metrics'),
    path('predict-health/', views.predict_health, name='predict_health'),
]
