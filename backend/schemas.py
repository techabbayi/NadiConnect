"""
Pydantic Schemas for Request/Response validation
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional


class ScanResponse(BaseModel):
    """Response schema for injury scan"""
    scan_id: int
    injury_type: str
    confidence: float
    visual_notes: str
    visual_indicators: List[str]
    risk_level: str
    risk_reason: str
    risk_color: str
    risk_factors: Optional[List[str]] = None
    guidance: Dict
    timestamp: str
    disclaimer: str


class DoctorResponse(BaseModel):
    """Doctor information response"""
    id: int
    name: str
    specialization: str
    hospital: str
    distance_km: float
    rating: float
    available_slots: List[str]
    expertise: List[str]


class BookingRequest(BaseModel):
    """Appointment booking request"""
    doctor_id: int
    patient_name: str = Field(..., min_length=2, max_length=100)
    patient_phone: str = Field(..., min_length=10, max_length=15)
    appointment_slot: str
    injury_type: Optional[str] = None


class BookingResponse(BaseModel):
    """Appointment booking confirmation"""
    booking_id: int
    token_number: str
    doctor_name: str
    specialization: str
    appointment_slot: str
    status: str
    confirmation_message: str
    disclaimer: str


class AdminStatsResponse(BaseModel):
    """Admin dashboard statistics"""
    total_scans: int
    total_appointments: int
    risk_distribution: Dict[str, int]
    injury_distribution: Dict[str, int]
    recent_scans: List[Dict]
    recent_appointments: Optional[List[Dict]] = []


class HealthAssessmentRequest(BaseModel):
    """Health assessment questionnaire request"""
    pain_level: str = Field(...,
                            description="Pain level: mild, moderate, severe")
    swelling: str = Field(...,
                          description="Swelling severity: none, mild, moderate, severe")
    duration: str = Field(..., description="How long symptoms have persisted")
    affected_area: str = Field(..., description="Body part affected")
    movement_difficulty: str = Field(
        ..., description="Difficulty moving: none, mild, moderate, severe, unable")
    redness: str = Field(..., description="Presence of redness: yes, no")
    warmth: str = Field(..., description="Area feels warm: yes, no")
    additional_notes: Optional[str] = None


class HealthAssessmentResponse(BaseModel):
    """Health assessment analysis response"""
    analysis_id: int
    risk_level: str
    risk_color: str
    risk_score: int
    risk_factors: List[str]
    urgency: str
    possible_conditions: List[Dict]
    detected_patterns: List[str]
    recommendations: List[str]
    treatment_guidance: Dict
    affected_area: str
    confidence_score: float
    timestamp: str
    analysis_method: str
    disclaimer: str


class VoiceAnalysisRequest(BaseModel):
    """Voice input analysis request (metadata)"""
    filename: str
    duration: Optional[float] = None


class VoiceAnalysisResponse(BaseModel):
    """Voice analysis response"""
    transcribed_text: str
    confidence: float
    detected_language: str
    extracted_info: Dict
    analysis: Dict
    timestamp: str


class ChatMessageRequest(BaseModel):
    """Chat message request"""
    message: str = Field(..., min_length=1, max_length=1000)
    context: Optional[Dict] = None


class ChatMessageResponse(BaseModel):
    """Chat response"""
    response: str
    intent: str
    confidence: float
    follow_up_questions: List[str]
    entities_detected: Dict
    timestamp: str
    conversation_id: int
