# MediDoctor AI Platform

<div align="center">

🏥 **AI-Assisted Visual Triage for Injury Assessment**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-Demo-blue)](LICENSE)

**⚠️ PROTOTYPE ONLY - Not for real medical diagnosis or treatment**

</div>

---

## 🎯 Project Overview

MediDoctor AI is a **demo-ready prototype** of an AI-powered digital doctor platform that enables:

- 📸 **Injury Scanning** via device camera
- 🤖 **AI Analysis** using rule-based logic (simulated)
- ⚡ **Risk Classification** (Low/Medium/High)
- 💊 **Smart Guidance** with first-aid recommendations
- 👨‍⚕️ **Doctor Matching** and appointment booking
- 📊 **Admin Dashboard** with analytics

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** ORM
- **SQLite** database
- **Pydantic** validation
- **Uvicorn** ASGI server

### AI Logic
- Rule-based classification (NO real ML models)
- Mock confidence scoring
- Simulated visual analysis

## 📁 Project Structure

```
MediDoctor/
├── backend/                    # FastAPI Backend
│   ├── main.py                # Main API application
│   ├── database.py            # Database configuration
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── services/              # Business logic
│   │   ├── ai_service.py      # Mock AI detection
│   │   ├── risk_service.py    # Risk classification
│   │   ├── guidance_service.py# Treatment guidance
│   │   └── doctor_service.py  # Doctor recommendations
│   ├── requirements.txt       # Python dependencies
│   └── README.md
│
└── medidoctor/                # Next.js Frontend
    ├── app/                   # App Router pages
    │   ├── page.tsx           # Landing page
    │   ├── scan/page.tsx      # Camera scan page
    │   ├── results/page.tsx   # AI results page
    │   ├── doctors/page.tsx   # Doctor listings
    │   ├── booking/page.tsx   # Appointment booking
    │   └── admin/page.tsx     # Admin dashboard
    ├── components/            # Reusable components
    │   ├── CameraCapture.tsx
    │   ├── ConfidenceMeter.tsx
    │   ├── RiskBadge.tsx
    │   ├── Disclaimer.tsx
    │   └── LoadingSpinner.tsx
    ├── services/              # API integration
    │   └── api.ts
    ├── lib/                   # Utilities
    │   └── utils.ts
    └── package.json
```

## 🛠️ Local Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+
- **Git**

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python main.py
```

Backend will be available at:
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs

### Frontend Setup

```bash
# Navigate to frontend folder
cd medidoctor

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:3000

## 🎮 Usage Flow

1. **Landing Page** → Read disclaimer and click "Start Injury Scan"
2. **Scan Page** → Capture or upload injury photo
3. **AI Analysis** → View injury type, confidence, and risk level
4. **Results Page** → Review guidance and warnings
5. **Find Doctors** → Browse recommended specialists
6. **Book Appointment** → Select slot and confirm booking
7. **Confirmation** → Receive token number

### Admin Dashboard
Access at: http://localhost:3000/admin

View:
- Total scans and appointments
- Risk level distribution
- Injury type analytics
- Recent scan history

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/scan` | Upload injury image for AI analysis |
| `GET` | `/api/doctors` | Get recommended doctors (filtered) |
| `POST` | `/api/book` | Book appointment with doctor |
| `GET` | `/api/admin/stats` | Get platform analytics |

### Example API Request

```bash
# Scan injury
curl -X POST http://localhost:8000/api/scan \
  -F "image=@injury.jpg"

# Get doctors
curl http://localhost:8000/api/doctors?injury_type=cut&risk_level=LOW

# Book appointment
curl -X POST http://localhost:8000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": 1,
    "patient_name": "John Doe",
    "patient_phone": "1234567890",
    "appointment_slot": "Today 2:00 PM"
  }'
```

## 🚢 Deployment

### Backend (Render / Railway)

**Render:**
1. Connect GitHub repository
2. Select `backend` folder as root
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Railway:**
1. Connect repository
2. Set root directory: `/backend`
3. Auto-detects Python and installs dependencies

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd medidoctor
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
```

Or deploy via [Vercel Dashboard](https://vercel.com):
- Import GitHub repository
- Framework: Next.js
- Root Directory: `medidoctor`
- Add environment variable: `NEXT_PUBLIC_API_URL`

## ⚠️ Important Disclaimers

- **PROTOTYPE ONLY** - Not for real medical diagnosis
- **NO REAL AI** - Uses rule-based logic simulation
- **NO MEDICAL LIABILITY** - Educational/demo purposes
- **NO REAL BOOKINGS** - Demo appointments only
- **ALWAYS** consult qualified healthcare professionals

## 🎨 Features Implemented

✅ Camera-based injury scanning  
✅ Mock AI visual analysis  
✅ 3-tier risk classification (Low/Medium/High)  
✅ Confidence meter visualization  
✅ First-aid guidance generation  
✅ Doctor recommendations (8 mock doctors)  
✅ Appointment booking system  
✅ Token number generation  
✅ Admin analytics dashboard  
✅ Mobile-responsive design  
✅ Disclaimer on every page  
✅ Clean medical UI/UX  

## 📊 Database Schema

**ScanResult**
- injury_type, confidence_score, risk_level
- visual_notes, image_path, timestamp

**Doctor**
- name, specialization, hospital
- distance_km, rating, available_slots, expertise

**Appointment**
- doctor_id, patient_name, patient_phone
- appointment_slot, token_number, status

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd backend
pytest

# Frontend tests (if implemented)
cd medidoctor
npm test
```

## 🤝 Contributing

This is a hackathon/demo project. For improvements:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📜 License

This is a **demonstration prototype**. Not licensed for production medical use.

## 👥 Team

Built with ❤️ for AI healthcare innovation demos.

## 📞 Support

For questions or issues:
- Open GitHub issue
- Check Swagger docs at `/api/docs`
- Review this README

---

<div align="center">

**⚠️ REMEMBER: This is a PROTOTYPE for demonstration purposes only**

**Not intended for medical diagnosis or treatment**

**Always consult qualified healthcare professionals for medical advice**

</div>
