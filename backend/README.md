# MediDoctor Backend

Python backend service for the AI Digital Doctor Platform.

## Quick Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

## API will be available at:
- Main API: http://localhost:8000
- Swagger Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Manual Run
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables
Create `.env` file if needed (currently using SQLite defaults)

## Database
- SQLite database (`medidoctor.db`) is created automatically
- Mock doctor data is seeded on startup

## API Endpoints

### POST /api/scan
Upload injury image for AI analysis
- Input: image file
- Output: diagnosis, risk level, guidance

### GET /api/doctors
Get recommended doctors
- Query params: injury_type, risk_level, limit
- Output: filtered doctor list

### POST /api/book
Book appointment
- Input: booking details
- Output: confirmation with token number

### GET /api/admin/stats
Get platform statistics (admin only)
- Output: analytics data

## Deployment (Render/Railway)

### Render
1. Connect GitHub repo
2. Select backend folder
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Railway
1. Connect repo
2. Set root directory to `/backend`
3. Railway auto-detects Python and requirements.txt

## ⚠️ Important
This is a PROTOTYPE ONLY. Not for real medical use.
