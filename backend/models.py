"""
Database Models
SQLAlchemy ORM models for MediDoctor platform
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from database import Base


class ScanResult(Base):
    """Stores AI scan analysis results"""
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    injury_type = Column(String(50), nullable=False)
    confidence_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    image_path = Column(String(255), nullable=True)
    visual_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ScanResult {self.id}: {self.injury_type} ({self.risk_level})>"


class Doctor(Base):
    """Doctor information (mock data)"""
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    hospital = Column(String(200), nullable=False)
    distance_km = Column(Float, nullable=False)
    rating = Column(Float, nullable=False)
    available_slots = Column(Text, nullable=True)  # JSON string
    expertise = Column(Text, nullable=True)  # Comma-separated
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Doctor {self.name} - {self.specialization}>"


class Appointment(Base):
    """Appointment bookings"""
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, nullable=False)
    patient_name = Column(String(100), nullable=False)
    patient_phone = Column(String(20), nullable=False)
    appointment_slot = Column(String(50), nullable=False)
    injury_type = Column(String(50), nullable=True)
    token_number = Column(String(20), unique=True, nullable=False)
    status = Column(String(20), default="confirmed")
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Appointment {self.token_number}: {self.patient_name}>"
