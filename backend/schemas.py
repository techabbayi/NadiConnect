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
