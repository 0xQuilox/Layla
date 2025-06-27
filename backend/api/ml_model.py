
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import os

class DeviceHealthPredictor:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize or load the pre-trained model"""
        model_path = 'api/models/device_health_model.pkl'
        scaler_path = 'api/models/scaler.pkl'
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            try:
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
                self.is_trained = True
                print("Loaded pre-trained model successfully")
            except Exception as e:
                print(f"Error loading model: {e}")
                self._create_dummy_model()
        else:
            self._create_dummy_model()
    
    def _create_dummy_model(self):
        """Create a simple model with dummy data for demonstration"""
        print("Creating dummy model for demonstration...")
        
        # Generate synthetic training data
        np.random.seed(42)
        n_samples = 1000
        
        # Features: battery_level, cpu_usage, storage_usage, temperature, network_latency
        X = np.random.rand(n_samples, 5) * 100
        
        # Synthetic health score based on features
        health_scores = []
        for i in range(n_samples):
            battery, cpu, storage, temp, latency = X[i]
            
            # Calculate health score based on device metrics
            score = 100
            
            # Battery impact
            if battery < 20:
                score -= 30
            elif battery < 50:
                score -= 15
            
            # CPU impact
            if cpu > 80:
                score -= 20
            elif cpu > 60:
                score -= 10
            
            # Storage impact
            if storage > 90:
                score -= 25
            elif storage > 75:
                score -= 10
            
            # Temperature impact
            if temp > 40:
                score -= 15
            elif temp > 35:
                score -= 5
            
            # Network latency impact
            if latency > 150:
                score -= 10
            elif latency > 100:
                score -= 5
            
            # Add some noise
            score += np.random.normal(0, 5)
            score = max(0, min(100, score))
            health_scores.append(score)
        
        y = np.array(health_scores)
        
        # Train the model
        X_scaled = self.scaler.fit_transform(X)
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        # Save the model
        os.makedirs('api/models', exist_ok=True)
        joblib.dump(self.model, 'api/models/device_health_model.pkl')
        joblib.dump(self.scaler, 'api/models/scaler.pkl')
        
        print("Dummy model created and saved successfully")
    
    def predict_health(self, features):
        """Predict device health score and potential issues"""
        if not self.is_trained:
            raise ValueError("Model is not trained")
        
        # Normalize features
        features_array = np.array(features).reshape(1, -1)
        features_scaled = self.scaler.transform(features_array)
        
        # Predict health score
        health_score = self.model.predict(features_scaled)[0]
        health_score = max(0, min(100, health_score))
        
        # Determine risks and recommendations based on features and score
        risks = self._analyze_risks(features, health_score)
        recommendations = self._generate_recommendations(features, health_score)
        predicted_issues = self._predict_specific_issues(features, health_score)
        
        return {
            'health_score': round(health_score, 1),
            'risks': risks,
            'recommendations': recommendations,
            'predicted_issues': predicted_issues
        }
    
    def _analyze_risks(self, features, health_score):
        """Analyze potential risks based on device metrics"""
        battery, cpu, storage, temp, latency = features
        risks = []
        
        if battery < 20:
            risks.append("Critical battery level detected")
        elif battery < 50:
            risks.append("Low battery level may indicate degradation")
        
        if cpu > 80:
            risks.append("High CPU usage may cause overheating")
        elif cpu > 60:
            risks.append("Elevated CPU usage detected")
        
        if storage > 90:
            risks.append("Storage nearly full - performance impact likely")
        elif storage > 75:
            risks.append("Storage usage is high")
        
        if temp > 40:
            risks.append("Device temperature is high - thermal throttling risk")
        elif temp > 35:
            risks.append("Device temperature elevated")
        
        if latency > 150:
            risks.append("Network connectivity issues detected")
        
        if health_score < 40:
            risks.append("Overall device health is poor")
        elif health_score < 60:
            risks.append("Device showing signs of degradation")
        
        return risks[:5]  # Limit to top 5 risks
    
    def _generate_recommendations(self, features, health_score):
        """Generate recommendations based on analysis"""
        battery, cpu, storage, temp, latency = features
        recommendations = []
        
        if battery < 50:
            recommendations.append("Consider battery calibration or replacement")
        
        if cpu > 60:
            recommendations.append("Close unnecessary background applications")
            recommendations.append("Restart device to clear memory")
        
        if storage > 75:
            recommendations.append("Free up storage space by removing unused files")
            recommendations.append("Clear app caches and temporary files")
        
        if temp > 35:
            recommendations.append("Ensure proper device ventilation")
            recommendations.append("Avoid using device in direct sunlight")
        
        if latency > 100:
            recommendations.append("Check network connection stability")
        
        if health_score < 60:
            recommendations.append("Schedule regular device maintenance")
            recommendations.append("Consider professional diagnostic check")
        
        recommendations.append("Keep software and apps updated")
        recommendations.append("Regular device restarts improve performance")
        
        return recommendations[:6]  # Limit to top 6 recommendations
    
    def _predict_specific_issues(self, features, health_score):
        """Predict specific issues that may occur"""
        battery, cpu, storage, temp, latency = features
        issues = []
        
        if battery < 30 and health_score < 70:
            issues.append("Battery failure likely within 3-6 months")
        
        if cpu > 70 and temp > 35:
            issues.append("Performance degradation expected due to thermal throttling")
        
        if storage > 85:
            issues.append("App crashes may occur due to insufficient storage")
        
        if health_score < 40:
            issues.append("Multiple hardware failures possible")
        
        return issues
