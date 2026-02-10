"""
Doctor Service
==============
Manages mock doctor data and recommendations.
"""

import json
from database import SessionLocal, engine
from models import Doctor, Base


class DoctorService:
    """
    Provides doctor recommendations based on injury and risk.
    Uses mock data for demonstration.
    """

    def initialize_mock_doctors(self):
        """
        Initialize database with mock doctor data.
        Only runs if database is empty.
        """
        db = SessionLocal()

        # Check if doctors already exist
        existing = db.query(Doctor).first()
        if existing:
            db.close()
            return

        # Create mock doctors
        mock_doctors = [
            {
                "name": "Dr. Sarah Johnson",
                "specialization": "Emergency Medicine",
                "hospital": "City General Hospital",
                "distance_km": 2.5,
                "rating": 4.8,
                "available_slots": json.dumps([
                    "Today 2:00 PM", "Today 4:00 PM", "Tomorrow 10:00 AM",
                    "Tomorrow 2:00 PM", "Tomorrow 5:00 PM"
                ]),
                "expertise": "trauma,burns,fractures,emergency_care"
            },
            {
                "name": "Dr. Michael Chen",
                "specialization": "Orthopedic Surgery",
                "hospital": "Medical Center Plus",
                "distance_km": 3.2,
                "rating": 4.9,
                "available_slots": json.dumps([
                    "Tomorrow 9:00 AM", "Tomorrow 11:00 AM",
                    "Feb 11 10:00 AM", "Feb 11 3:00 PM"
                ]),
                "expertise": "fractures,bone_injuries,sports_injuries"
            },
            {
                "name": "Dr. Emily Rodriguez",
                "specialization": "Dermatology",
                "hospital": "Skin Care Clinic",
                "distance_km": 1.8,
                "rating": 4.7,
                "available_slots": json.dumps([
                    "Today 3:00 PM", "Tomorrow 10:00 AM",
                    "Tomorrow 1:00 PM", "Feb 10 2:00 PM"
                ]),
                "expertise": "rash,burns,skin_conditions,allergies"
            },
            {
                "name": "Dr. James Williams",
                "specialization": "General Practice",
                "hospital": "Community Health Center",
                "distance_km": 1.2,
                "rating": 4.6,
                "available_slots": json.dumps([
                    "Today 1:00 PM", "Today 3:30 PM", "Today 5:00 PM",
                    "Tomorrow 9:00 AM", "Tomorrow 11:00 AM", "Tomorrow 2:00 PM"
                ]),
                "expertise": "general_care,cuts,bruises,minor_injuries"
            },
            {
                "name": "Dr. Lisa Patel",
                "specialization": "Urgent Care Physician",
                "hospital": "QuickCare Medical",
                "distance_km": 2.0,
                "rating": 4.5,
                "available_slots": json.dumps([
                    "Today 12:00 PM", "Today 2:00 PM", "Today 4:00 PM",
                    "Today 6:00 PM", "Tomorrow 10:00 AM"
                ]),
                "expertise": "urgent_care,minor_trauma,burns,cuts"
            },
            {
                "name": "Dr. Robert Kumar",
                "specialization": "Sports Medicine",
                "hospital": "Athletes Medical Institute",
                "distance_km": 4.5,
                "rating": 4.8,
                "available_slots": json.dumps([
                    "Tomorrow 8:00 AM", "Tomorrow 10:00 AM",
                    "Feb 11 9:00 AM", "Feb 11 2:00 PM"
                ]),
                "expertise": "sports_injuries,fractures,swelling,sprains"
            },
            {
                "name": "Dr. Amanda Foster",
                "specialization": "Plastic Surgery",
                "hospital": "Cosmetic & Reconstructive Center",
                "distance_km": 5.2,
                "rating": 4.9,
                "available_slots": json.dumps([
                    "Feb 10 11:00 AM", "Feb 10 3:00 PM",
                    "Feb 11 10:00 AM", "Feb 12 2:00 PM"
                ]),
                "expertise": "burns,skin_reconstruction,wound_care"
            },
            {
                "name": "Dr. David Martinez",
                "specialization": "Pediatrics",
                "hospital": "Children's Health Center",
                "distance_km": 2.8,
                "rating": 4.7,
                "available_slots": json.dumps([
                    "Today 2:30 PM", "Tomorrow 9:30 AM",
                    "Tomorrow 1:30 PM", "Tomorrow 4:00 PM"
                ]),
                "expertise": "pediatric_care,children_injuries,rash,burns"
            }
        ]

        # Insert into database
        for doc_data in mock_doctors:
            doctor = Doctor(**doc_data)
            db.add(doctor)

        db.commit()
        db.close()
        print(f"✅ Initialized {len(mock_doctors)} mock doctors")

    def get_recommended_doctors(
        self,
        injury_type: str = None,
        risk_level: str = None,
        limit: int = 10
    ):
        """
        Get recommended doctors based on injury and risk.
        Returns filtered and sorted list.
        """
        db = SessionLocal()

        # Query all doctors
        query = db.query(Doctor)

        # Filter by expertise if injury type provided
        if injury_type:
            # Match expertise keywords
            doctors = query.all()
            filtered = []

            for doctor in doctors:
                expertise_list = doctor.expertise.split(',')

                # Check if injury type matches expertise
                if injury_type in expertise_list or \
                   "general_care" in expertise_list or \
                   "urgent_care" in expertise_list or \
                   "emergency_care" in expertise_list:
                    filtered.append(doctor)

            doctors = filtered
        else:
            doctors = query.all()

        # Sort by priority
        if risk_level == "HIGH":
            # Prioritize emergency and urgent care
            doctors = sorted(
                doctors,
                key=lambda d: (
                    "emergency" in d.specialization.lower() or "urgent" in d.specialization.lower(),
                    d.distance_km
                ),
                reverse=True
            )
        else:
            # Sort by distance and rating
            doctors = sorted(
                doctors,
                key=lambda d: (d.distance_km, -d.rating)
            )

        # Limit results
        doctors = doctors[:limit]

        # Format response
        result = []
        for doctor in doctors:
            result.append({
                "id": doctor.id,
                "name": doctor.name,
                "specialization": doctor.specialization,
                "hospital": doctor.hospital,
                "distance_km": doctor.distance_km,
                "rating": doctor.rating,
                "available_slots": json.loads(doctor.available_slots),
                "expertise": doctor.expertise.split(',')
            })

        db.close()
        return result
