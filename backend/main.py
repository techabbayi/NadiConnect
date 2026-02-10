"""
MediDoctor AI Digital Doctor Platform - FastAPI Backend
========================================================
This is a PROTOTYPE ONLY - Not for real medical diagnosis
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
import os

from database import engine, Base
from models import Doctor, ScanResult, Appointment
from schemas import (
    ScanResponse,
    DoctorResponse,
    BookingRequest,
    BookingResponse,
    AdminStatsResponse
)
from services.ai_service import AIService
from services.risk_service import RiskClassifier
from services.guidance_service import GuidanceEngine
from services.doctor_service import DoctorService

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="MediDoctor AI Platform",
    description="AI-Assisted Visual Triage System (PROTOTYPE ONLY)",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ai_service = AIService()
risk_classifier = RiskClassifier()
guidance_engine = GuidanceEngine()
doctor_service = DoctorService()


@app.get("/")
async def root():
    """API Health Check"""
    return {
        "status": "online",
        "service": "MediDoctor AI Platform",
        "version": "1.0.0",
        "disclaimer": "PROTOTYPE ONLY - Not for medical diagnosis"
    }


@app.post("/api/scan", response_model=ScanResponse)
async def scan_injury(image: UploadFile = File(...)):
    """
    AI Injury Scan Endpoint
    ------------------------
    Accepts an image and returns mock AI analysis:
    - Injury type detection
    - Confidence score
    - Risk classification
    - Treatment guidance

    WARNING: This is simulated AI for demonstration only.
    """
    try:
        # Read image content
        image_content = await image.read()

        # Save image (optional, for demo purposes)
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{upload_dir}/scan_{timestamp}.jpg"

        with open(filename, "wb") as f:
            f.write(image_content)

        # Mock AI Analysis
        ai_result = ai_service.analyze_injury(image_content, image.filename)

        # Risk Classification
        risk_data = risk_classifier.classify_risk(
            ai_result["injury_type"],
            ai_result["confidence"],
            ai_result.get("visual_notes", "")
        )

        # Generate Guidance
        guidance = guidance_engine.generate_guidance(
            ai_result["injury_type"],
            risk_data["risk_level"]
        )

        # Store scan result in database
        from database import SessionLocal
        db = SessionLocal()

        scan_record = ScanResult(
            injury_type=ai_result["injury_type"],
            confidence_score=ai_result["confidence"],
            risk_level=risk_data["risk_level"],
            image_path=filename,
            visual_notes=ai_result["visual_notes"]
        )
        db.add(scan_record)
        db.commit()
        db.refresh(scan_record)
        db.close()

        # Construct response
        response = {
            "scan_id": scan_record.id,
            "injury_type": ai_result["injury_type"],
            "confidence": ai_result["confidence"],
            "visual_notes": ai_result["visual_notes"],
            "visual_indicators": ai_result.get("visual_indicators", []),
            "risk_level": risk_data["risk_level"],
            "risk_reason": risk_data["risk_reason"],
            "risk_color": risk_data["risk_color"],
            "risk_factors": risk_data.get("risk_factors", []),
            "guidance": guidance,
            "timestamp": scan_record.created_at.isoformat(),
            "disclaimer": "This is a prototype for demonstration purposes only. Not intended for medical diagnosis or treatment."
        }

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")


@app.get("/api/doctors", response_model=list[DoctorResponse])
async def get_doctors(
    injury_type: str = None,
    risk_level: str = None,
    limit: int = 10
):
    """
    Get Doctor Recommendations
    ---------------------------
    Returns filtered list of doctors based on injury type and risk level.
    Uses mock data for demonstration.
    """
    try:
        doctors = doctor_service.get_recommended_doctors(
            injury_type=injury_type,
            risk_level=risk_level,
            limit=limit
        )
        return doctors
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/book", response_model=BookingResponse)
async def book_appointment(booking: BookingRequest):
    """
    Book Appointment
    ----------------
    Creates a demo appointment booking and returns confirmation.
    """
    try:
        from database import SessionLocal
        import random

        db = SessionLocal()

        # Generate token number
        token_number = f"MD{random.randint(1000, 9999)}"

        # Create appointment record
        appointment = Appointment(
            doctor_id=booking.doctor_id,
            patient_name=booking.patient_name,
            patient_phone=booking.patient_phone,
            appointment_slot=booking.appointment_slot,
            injury_type=booking.injury_type,
            token_number=token_number,
            status="confirmed"
        )

        db.add(appointment)
        db.commit()
        db.refresh(appointment)

        # Get doctor details
        doctor = db.query(Doctor).filter(
            Doctor.id == booking.doctor_id).first()

        if not doctor:
            db.close()
            raise HTTPException(
                status_code=404,
                detail=f"Doctor with ID {booking.doctor_id} not found. Please refresh and try again."
            )

        doctor_name = doctor.name
        doctor_specialization = doctor.specialization

        db.close()

        response = {
            "booking_id": appointment.id,
            "token_number": token_number,
            "doctor_name": doctor_name,
            "specialization": doctor_specialization,
            "appointment_slot": booking.appointment_slot,
            "status": "confirmed",
            "confirmation_message": f"Appointment confirmed! Your token number is {token_number}",
            "disclaimer": "This is a demo booking. No real appointment has been created."
        }

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Booking failed: {str(e)}")


@app.get("/api/admin/stats", response_model=AdminStatsResponse)
async def get_admin_stats():
    """
    Admin Dashboard Statistics
    ---------------------------
    Returns analytics data for admin view.
    """
    try:
        from database import SessionLocal
        from sqlalchemy import func

        db = SessionLocal()

        # Total scans
        total_scans = db.query(func.count(ScanResult.id)).scalar()

        # Risk distribution
        risk_counts = db.query(
            ScanResult.risk_level,
            func.count(ScanResult.id)
        ).group_by(ScanResult.risk_level).all()

        risk_distribution = {level: count for level, count in risk_counts}

        # Total appointments
        total_appointments = db.query(func.count(Appointment.id)).scalar()

        # Recent scans
        recent_scans = db.query(ScanResult).order_by(
            ScanResult.created_at.desc()
        ).limit(10).all()

        recent_scans_data = [
            {
                "id": scan.id,
                "injury_type": scan.injury_type,
                "risk_level": scan.risk_level,
                "confidence": scan.confidence_score,
                "timestamp": scan.created_at.isoformat()
            }
            for scan in recent_scans
        ]

        # Recent appointments
        recent_appointments = db.query(Appointment).order_by(
            Appointment.created_at.desc()
        ).limit(10).all()

        recent_appointments_data = []
        for apt in recent_appointments:
            # Get doctor details
            doctor = db.query(Doctor).filter(
                Doctor.id == apt.doctor_id).first()
            apt_data = {
                "id": apt.id,
                "patient_name": apt.patient_name,
                "patient_phone": apt.patient_phone,
                "appointment_slot": apt.appointment_slot,
                "injury_type": apt.injury_type,
                "token_number": apt.token_number,
                "status": apt.status,
                "created_at": apt.created_at.isoformat(),
                "doctor_name": doctor.name if doctor else "Not Available",
                "hospital": doctor.hospital if doctor else "Not Available"
            }
            recent_appointments_data.append(apt_data)

        # Injury type distribution
        injury_counts = db.query(
            ScanResult.injury_type,
            func.count(ScanResult.id)
        ).group_by(ScanResult.injury_type).all()

        injury_distribution = {itype: count for itype, count in injury_counts}

        db.close()

        return {
            "total_scans": total_scans or 0,
            "total_appointments": total_appointments or 0,
            "risk_distribution": risk_distribution,
            "injury_distribution": injury_distribution,
            "recent_scans": recent_scans_data,
            "recent_appointments": recent_appointments_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.on_event("startup")
async def startup_event():
    """Initialize database with mock data"""
    doctor_service.initialize_mock_doctors()
    print("✅ MediDoctor API Started")
    print("📚 API Docs: http://localhost:8000/api/docs")
    print("⚠️  PROTOTYPE ONLY - Not for medical use")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
