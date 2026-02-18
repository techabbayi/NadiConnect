"""
Health Assessment Service with AI/ML and Rule-Based Analysis
=============================================================
Analyzes health questionnaire responses and voice inputs
using AI, ML algorithms, and medical rule-based systems.
"""

import random
from typing import Dict, List, Optional
from datetime import datetime


class HealthAssessmentService:
    """
    Advanced health assessment combining:
    - Machine Learning models (simulated)
    - Rule-based medical expertise systems
    - Pattern recognition algorithms
    - Risk stratification
    """

    def __init__(self):
        # Medical knowledge base for rule-based analysis
        self.medical_rules = {
            'pain_severity_rules': {
                'mild': {'risk_score': 1, 'urgency': 'low'},
                'moderate': {'risk_score': 2, 'urgency': 'medium'},
                'severe': {'risk_score': 4, 'urgency': 'high'}
            },
            'swelling_rules': {
                'none': {'risk_score': 0},
                'mild': {'risk_score': 1},
                'moderate': {'risk_score': 2},
                'severe': {'risk_score': 3}
            },
            'duration_rules': {
                'less than 24 hours': {'risk_score': 1},
                '1-2 days': {'risk_score': 1},
                '3-7 days': {'risk_score': 2},
                '1 week+': {'risk_score': 3},
                '2 weeks+': {'risk_score': 4}
            }
        }

        # ML-based pattern classifications
        self.injury_patterns = {
            'acute_trauma': ['sharp', 'sudden', 'severe', 'recent', 'accident'],
            'inflammation': ['swelling', 'redness', 'warmth', 'throbbing'],
            'chronic_condition': ['persistent', 'recurring', 'weeks', 'months'],
            'infection': ['fever', 'pus', 'hot', 'red', 'spreading']
        }

    def analyze_questionnaire(self, responses: Dict) -> Dict:
        """
        Analyze health questionnaire responses using AI/ML and rules.

        Args:
            responses: Dict containing user answers to health questions

        Returns:
            Comprehensive analysis with diagnosis, risk level, and recommendations
        """

        # Extract key metrics
        pain_level = responses.get('pain_level', 'moderate')
        swelling = responses.get('swelling', 'moderate')
        duration = responses.get('duration', '1-2 days')
        affected_area = responses.get('affected_area', 'unknown')
        movement_difficulty = responses.get('movement_difficulty', 'moderate')
        redness = responses.get('redness', 'no')
        warmth = responses.get('warmth', 'no')

        # Rule-based risk scoring
        risk_score = 0
        risk_factors = []

        # Apply pain severity rules
        pain_data = self.medical_rules['pain_severity_rules'].get(
            pain_level, {'risk_score': 2, 'urgency': 'medium'})
        risk_score += pain_data['risk_score']
        if pain_level == 'severe':
            risk_factors.append(
                "Severe pain reported - requires immediate attention")

        # Apply swelling rules
        swelling_data = self.medical_rules['swelling_rules'].get(
            swelling, {'risk_score': 1})
        risk_score += swelling_data['risk_score']
        if swelling in ['moderate', 'severe']:
            risk_factors.append(f"{swelling.capitalize()} swelling detected")

        # Apply duration rules
        duration_data = self.medical_rules['duration_rules'].get(
            duration, {'risk_score': 1})
        risk_score += duration_data['risk_score']
        if '2 weeks+' in duration or '1 week+' in duration:
            risk_factors.append(
                "Prolonged symptoms - chronic condition possible")

        # Movement difficulty analysis
        if movement_difficulty in ['severe', 'unable']:
            risk_score += 2
            risk_factors.append("Significant mobility impairment")

        # Inflammation indicators
        inflammation_markers = 0
        if redness == 'yes':
            inflammation_markers += 1
            risk_factors.append("Redness present - inflammation indicated")
        if warmth == 'yes':
            inflammation_markers += 1
            risk_factors.append("Warmth detected - active inflammation")
        risk_score += inflammation_markers

        # ML-based pattern recognition (simulated neural network)
        detected_patterns = self._ml_pattern_detection(responses)

        # Determine risk level using hybrid AI approach
        if risk_score >= 8:
            risk_level = "HIGH"
            risk_color = "red"
            urgency = "immediate"
        elif risk_score >= 5:
            risk_level = "MEDIUM"
            risk_color = "orange"
            urgency = "same-day"
        else:
            risk_level = "LOW"
            risk_color = "green"
            urgency = "routine"

        # Generate AI-powered diagnosis suggestions
        possible_conditions = self._generate_conditions(
            responses, detected_patterns)

        # Generate personalized recommendations
        recommendations = self._generate_recommendations(
            risk_level, affected_area, detected_patterns, urgency
        )

        # Generate treatment guidance
        treatment_guidance = self._generate_treatment_guidance(
            pain_level, swelling, detected_patterns
        )

        return {
            "analysis_id": random.randint(10000, 99999),
            "risk_level": risk_level,
            "risk_color": risk_color,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
            "urgency": urgency,
            "possible_conditions": possible_conditions,
            "detected_patterns": detected_patterns,
            "recommendations": recommendations,
            "treatment_guidance": treatment_guidance,
            "affected_area": affected_area,
            "confidence_score": round(min(0.95, 0.70 + (risk_score * 0.03)), 2),
            "timestamp": datetime.now().isoformat(),
            "analysis_method": "Hybrid AI/ML + Rule-Based Medical Expert System",
            "disclaimer": "AI-generated assessment. Not a substitute for professional medical diagnosis."
        }

    def _ml_pattern_detection(self, responses: Dict) -> List[str]:
        """
        Simulate ML-based pattern recognition using neural network approach.
        In production, this would use actual ML models (scikit-learn, TensorFlow, etc.)
        """
        detected = []

        # Create feature vector from responses
        response_text = ' '.join(str(v).lower() for v in responses.values())

        # Pattern matching using simulated ML
        for pattern_name, keywords in self.injury_patterns.items():
            matches = sum(
                1 for keyword in keywords if keyword in response_text)
            # Simulate ML confidence threshold
            if matches >= 2:
                detected.append(pattern_name)

        return detected if detected else ['general_injury']

    def _generate_conditions(self, responses: Dict, patterns: List[str]) -> List[Dict]:
        """Generate possible medical conditions based on AI analysis"""
        conditions = []

        pain_level = responses.get('pain_level', 'moderate')
        swelling = responses.get('swelling', 'moderate')

        if 'acute_trauma' in patterns:
            conditions.append({
                "name": "Acute Soft Tissue Injury",
                "probability": "high" if pain_level == 'severe' else "medium",
                "description": "Injury to muscles, ligaments, or tendons"
            })

        if 'inflammation' in patterns or swelling in ['moderate', 'severe']:
            conditions.append({
                "name": "Inflammatory Response",
                "probability": "high",
                "description": "Active tissue inflammation requiring attention"
            })

        if 'chronic_condition' in patterns:
            conditions.append({
                "name": "Chronic Musculoskeletal Condition",
                "probability": "medium",
                "description": "Persistent condition requiring specialist evaluation"
            })

        if 'infection' in patterns:
            conditions.append({
                "name": "Possible Infection",
                "probability": "medium",
                "description": "Signs suggesting infectious process - urgent medical review needed"
            })

        if not conditions:
            conditions.append({
                "name": "Minor Injury",
                "probability": "medium",
                "description": "Common minor injury with standard healing process"
            })

        return conditions

    def _generate_recommendations(self, risk_level: str, area: str, patterns: List, urgency: str) -> List[str]:
        """Generate AI-powered recommendations"""
        recs = []

        if urgency == "immediate":
            recs.append(
                "🚨 Seek immediate medical attention - visit emergency department")
            recs.append("Do not delay treatment - severe symptoms detected")
        elif urgency == "same-day":
            recs.append("📅 Schedule medical consultation within 24 hours")
            recs.append("Monitor symptoms closely for any worsening")
        else:
            recs.append("📋 Consider scheduling routine medical evaluation")
            recs.append("Follow home care guidelines and monitor progress")

        if 'inflammation' in patterns:
            recs.append(
                "Apply cold compress for 15-20 minutes every 2-3 hours")
            recs.append("Elevate affected area to reduce swelling")

        if area != 'unknown':
            recs.append(f"Limit use of {area} until medical evaluation")
            recs.append("Avoid activities that worsen symptoms")

        recs.append("Document any changes in symptoms")
        recs.append("Stay hydrated and get adequate rest")

        return recs

    def _generate_treatment_guidance(self, pain: str, swelling: str, patterns: List) -> Dict:
        """Generate treatment guidance based on AI analysis"""

        guidance = {
            "immediate_care": [],
            "medications": [],
            "activities": [],
            "warning_signs": []
        }

        # Immediate care based on symptoms
        if swelling in ['moderate', 'severe']:
            guidance["immediate_care"].extend([
                "RICE protocol: Rest, Ice, Compression, Elevation",
                "Apply ice pack wrapped in cloth for 15-20 minutes",
                "Keep affected area elevated above heart level when possible"
            ])

        # Medication guidance (over-the-counter)
        if pain in ['moderate', 'severe']:
            guidance["medications"].extend([
                "Over-the-counter pain relief may be considered (consult pharmacist)",
                "Follow dosage instructions carefully",
                "Take with food if recommended"
            ])

        # Activity modifications
        guidance["activities"].extend([
            "Avoid strenuous activities until symptoms improve",
            "Use supportive devices if recommended by healthcare provider",
            "Gentle range-of-motion exercises after initial 48 hours (if approved)"
        ])

        # Warning signs requiring immediate attention
        guidance["warning_signs"].extend([
            "Sudden increase in pain or swelling",
            "Fever above 100.4°F (38°C)",
            "Numbness or tingling that worsens",
            "Loss of function or inability to bear weight",
            "Signs of infection (increased redness, pus, warmth)",
            "Symptoms that don't improve after 48-72 hours"
        ])

        return guidance
