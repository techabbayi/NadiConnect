# 🚀 Quick Start - Health Assessment Features

## Start the Application

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn main:app --reload
```
**Expected:** Server starts at http://localhost:8000

### Terminal 2 - Frontend
```bash
cd medidoctor
npm run dev
```
**Expected:** Server starts at http://localhost:3000

---

## Quick Test Flows

### ✅ Test 1: Question-Based Assessment (2 mins)
1. Open http://localhost:3000
2. Click green **"Know Your Health"** button
3. Click **"Answer Questions"**
4. Select any option for each question (6 total)
5. Click **"Analyze with AI"**
6. ✅ See comprehensive results!

### ✅ Test 2: Voice Input (2 mins)
1. Open http://localhost:3000
2. Click green **"Know Your Health"** button
3. Click **"Voice Input"**
4. Click **"Start Recording"** (allow microphone)
5. Speak for 10 seconds about pain/symptoms
6. Click **"Stop Recording"**
7. Click **"Analyze Voice Input with AI"**
8. ✅ See voice transcription + analysis!

### ✅ Test 3: Voice Upload (1 min)
1. Go to health assessment page
2. Click **"Voice Input"**
3. Click **"Upload Audio File"**
4. Select any audio file (WAV, MP3)
5. Click **"Analyze Voice Input with AI"**
6. ✅ See results!

---

## API Testing (Optional)

### Test Health Assessment Endpoint
```bash
curl -X POST "http://localhost:8000/api/health-assessment" \
  -H "Content-Type: application/json" \
  -d '{
    "pain_level": "severe",
    "swelling": "moderate",
    "duration": "1-2 days",
    "affected_area": "knee",
    "movement_difficulty": "severe",
    "redness": "yes",
    "warmth": "yes"
  }'
```

### Test Chat Service
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have severe pain in my knee"}'
```

### View API Documentation
Open: http://localhost:8000/api/docs

---

## Key URLs

| Page | URL | Description |
|------|-----|-------------|
| **Home** | http://localhost:3000 | Main page with both buttons |
| **Health Assessment** | http://localhost:3000/health-assessment | New feature page |
| **Scan Injury** | http://localhost:3000/scan | Traditional photo scan |
| **API Docs** | http://localhost:8000/api/docs | Interactive API testing |
| **Admin Stats** | http://localhost:8000/api/admin/stats | View all assessments |

---

## What to Expect

### Risk Levels:
- 🟢 **LOW** (green) - Minor symptoms, routine care
- 🟠 **MEDIUM** (orange) - Moderate symptoms, same-day care
- 🔴 **HIGH** (red) - Severe symptoms, immediate attention

### Analysis Includes:
✅ Risk score (1-10)
✅ Possible conditions
✅ Risk factors
✅ Recommendations
✅ Treatment guidance
✅ Warning signs

---

## Quick Troubleshooting

**Backend won't start?**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

**Frontend won't start?**
```bash
cd medidoctor
npm install
npm run dev
```

**Microphone permission denied?**
- Use the "Upload Audio File" option instead
- Check browser settings for microphone access

**"Analysis failed" error?**
- Make sure backend is running (http://localhost:8000)
- Check terminal for error messages

---

## Sample Test Case

**Scenario:** High-risk injury

**Inputs:**
- Pain: Severe
- Swelling: Severe  
- Duration: Less than 24 hours
- Area: Knee
- Movement: Unable
- Redness: Yes
- Warmth: Yes

**Expected Result:**
- Risk Level: **HIGH** (red)
- Risk Score: 8-10
- Urgency: **IMMEDIATE**
- Recommendation: Seek emergency care

---

## Feature Highlights

### 🎤 Voice Features:
- Record directly in browser
- Upload audio files
- AI extracts symptoms
- Full analysis from speech

### 📋 Question Features:
- 6 targeted questions
- Progress tracking
- Input validation
- Guided flow

### 🧠 AI Analysis:
- Hybrid AI/ML + Rules
- Risk stratification
- Condition probability
- Treatment guidance

---

## Files Created

**Backend:**
- `backend/services/voice_service.py`
- `backend/services/health_assessment_service.py`
- `backend/services/chat_service.py`

**Frontend:**
- `medidoctor/components/VoiceRecorder.tsx`
- `medidoctor/app/health-assessment/page.tsx`

**Documentation:**
- `IMPLEMENTATION_SUMMARY.md` ← **Read this first!**
- `HEALTH_ASSESSMENT_FEATURES.md`
- `TESTING_GUIDE.md`

---

## Next Steps

1. ✅ Start backend and frontend
2. ✅ Try question-based assessment
3. ✅ Try voice recording
4. ✅ Review analysis results
5. ✅ Check API docs
6. 📖 Read full documentation

**Everything is ready to use!** 🎉

---

## Support

- **Feature docs:** `HEALTH_ASSESSMENT_FEATURES.md`
- **Testing guide:** `TESTING_GUIDE.md`
- **API reference:** http://localhost:8000/api/docs

**Enjoy your new AI-powered health assessment system!** 🚀
