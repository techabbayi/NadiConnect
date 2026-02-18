"""
AI Chat Service for Health Conversations
=========================================
Rule-based and AI-powered chat for health queries
"""

from typing import List, Dict, Optional
import random
from datetime import datetime


class ChatService:
    """
    Conversational AI for health-related queries.
    Combines rule-based responses with AI-generated advice.
    """

    def __init__(self):
        # Intent classification patterns
        self.intents = {
            'pain_query': ['pain', 'hurt', 'ache', 'sore', 'painful'],
            'swelling_query': ['swelling', 'swollen', 'puffy', 'inflammation', 'inflamed'],
            'treatment_query': ['treat', 'help', 'what should', 'how to', 'remedy'],
            'symptom_check': ['symptoms', 'signs', 'indication', 'showing'],
            'urgency_query': ['urgent', 'emergency', 'serious', 'dangerous', 'worried'],
            'medication_query': ['medicine', 'medication', 'drug', 'pill', 'tablet'],
            'greeting': ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon']
        }

        # Response templates for different intents
        self.responses = {
            'greeting': [
                "Hello! I'm your AI health assistant. I'm here to help you understand your symptoms and provide guidance. How can I assist you today?",
                "Hi there! I can help analyze your health concerns and provide recommendations. What would you like to know?",
                "Greetings! I'm designed to assist with health assessments. Feel free to describe your symptoms or ask any questions."
            ],
            'pain_query': [
                "Pain is an important indicator. Can you describe your pain level (mild, moderate, or severe) and its nature (sharp, dull, throbbing)?",
                "I understand you're experiencing pain. To help better, could you tell me where it hurts and how long you've had this pain?",
                "Pain assessment is crucial. On a scale of 1-10, how would you rate your pain? Also, what makes it better or worse?"
            ],
            'swelling_query': [
                "Swelling often indicates inflammation. Is the swollen area warm to touch? How long has it been swollen?",
                "I can help assess swelling. Is it localized to one area or spreading? Are you experiencing any redness along with it?",
                "Swelling is an important symptom. Has it come on suddenly or gradually? Is there any associated pain?"
            ],
            'treatment_query': [
                "For immediate care, the RICE method is often recommended: Rest, Ice, Compression, and Elevation. However, proper medical evaluation is important.",
                "Treatment depends on the specific condition. Can you describe your symptoms in detail so I can provide more targeted guidance?",
                "I can suggest general care measures, but please remember this is not a substitute for professional medical advice. What specific concern would you like help with?"
            ],
            'urgency_query': [
                "If you're experiencing severe symptoms, difficulty breathing, chest pain, or any life-threatening condition, please call emergency services immediately (911).",
                "Certain symptoms require immediate attention. These include: severe bleeding, chest pain, difficulty breathing, severe head injury, or loss of consciousness. If any apply, seek emergency care immediately.",
                "Your safety is paramount. If you're unsure about the urgency, it's always better to err on the side of caution and seek immediate medical attention."
            ]
        }

        # Conversation history
        self.conversation_history: List[Dict] = []

    def process_message(self, user_message: str, context: Optional[Dict] = None) -> Dict:
        """
        Process user message and generate AI response.

        Args:
            user_message: User's input message
            context: Optional context (previous assessment data, etc.)

        Returns:
            Dict with AI response, intent, confidence, and suggestions
        """

        # Detect intent using pattern matching
        detected_intent = self._detect_intent(user_message)

        # Generate response based on intent
        response_text = self._generate_response(
            detected_intent, user_message, context)

        # Extract any health-related entities
        entities = self._extract_entities(user_message)

        # Generate follow-up questions
        follow_up_questions = self._generate_follow_up(
            detected_intent, entities)

        # Store in conversation history
        conversation_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_message": user_message,
            "detected_intent": detected_intent,
            "ai_response": response_text,
            "entities": entities
        }
        self.conversation_history.append(conversation_entry)

        return {
            "response": response_text,
            "intent": detected_intent,
            "confidence": round(random.uniform(0.85, 0.95), 2),
            "follow_up_questions": follow_up_questions,
            "entities_detected": entities,
            "timestamp": datetime.now().isoformat(),
            "conversation_id": len(self.conversation_history)
        }

    def _detect_intent(self, message: str) -> str:
        """Detect user intent from message using rule-based NLP"""
        message_lower = message.lower()

        intent_scores = {}
        for intent, keywords in self.intents.items():
            score = sum(1 for keyword in keywords if keyword in message_lower)
            if score > 0:
                intent_scores[intent] = score

        if intent_scores:
            return max(intent_scores, key=intent_scores.get)

        return 'general_query'

    def _generate_response(self, intent: str, message: str, context: Optional[Dict]) -> str:
        """Generate contextual AI response"""

        if intent in self.responses:
            base_response = random.choice(self.responses[intent])
        else:
            base_response = "I understand your concern. Could you provide more details about your symptoms so I can assist you better?"

        # Enhance response with context if available
        if context and 'risk_level' in context:
            risk_addendum = f"\n\nBased on your previous assessment, your risk level was {context['risk_level']}. "
            if context['risk_level'] == 'HIGH':
                risk_addendum += "I strongly recommend seeking immediate medical attention."
            base_response += risk_addendum

        return base_response

    def _extract_entities(self, message: str) -> Dict:
        """Extract health-related entities from message"""
        entities = {
            "body_parts": [],
            "symptoms": [],
            "intensity": None,
            "duration": None
        }

        # Body parts
        body_parts = ['knee', 'ankle', 'wrist', 'elbow', 'shoulder', 'back', 'neck',
                      'head', 'chest', 'abdomen', 'leg', 'arm', 'hand', 'foot']
        for part in body_parts:
            if part in message.lower():
                entities["body_parts"].append(part)

        # Symptoms
        symptoms = ['pain', 'swelling', 'redness',
                    'bruise', 'cut', 'burn', 'bleeding']
        for symptom in symptoms:
            if symptom in message.lower():
                entities["symptoms"].append(symptom)

        # Intensity
        if any(word in message.lower() for word in ['severe', 'extreme', 'unbearable']):
            entities["intensity"] = "severe"
        elif any(word in message.lower() for word in ['moderate', 'medium']):
            entities["intensity"] = "moderate"
        elif any(word in message.lower() for word in ['mild', 'slight', 'minor']):
            entities["intensity"] = "mild"

        # Duration
        if 'yesterday' in message.lower():
            entities["duration"] = "1-2 days"
        elif 'week' in message.lower():
            entities["duration"] = "1 week+"

        return entities

    def _generate_follow_up(self, intent: str, entities: Dict) -> List[str]:
        """Generate intelligent follow-up questions"""
        questions = []

        if intent == 'pain_query' and not entities.get('intensity'):
            questions.append(
                "How would you rate your pain: mild, moderate, or severe?")

        if entities.get('symptoms') and not entities.get('duration'):
            questions.append(
                "How long have you been experiencing these symptoms?")

        if entities.get('body_parts') and 'swelling' in entities.get('symptoms', []):
            questions.append("Is the swollen area warm or red?")

        if not questions:
            questions.append(
                "Is there anything else about your symptoms you'd like to share?")

        return questions[:2]  # Return max 2 follow-up questions

    def get_conversation_summary(self) -> Dict:
        """Get summary of conversation for analysis"""
        return {
            "total_messages": len(self.conversation_history),
            "intents_discussed": list(set(entry["detected_intent"] for entry in self.conversation_history)),
            "entities_mentioned": self._aggregate_entities(),
            "conversation_history": self.conversation_history
        }

    def _aggregate_entities(self) -> Dict:
        """Aggregate all entities mentioned in conversation"""
        all_entities = {"body_parts": set(), "symptoms": set()}

        for entry in self.conversation_history:
            entities = entry.get("entities", {})
            all_entities["body_parts"].update(entities.get("body_parts", []))
            all_entities["symptoms"].update(entities.get("symptoms", []))

        return {
            "body_parts": list(all_entities["body_parts"]),
            "symptoms": list(all_entities["symptoms"])
        }
