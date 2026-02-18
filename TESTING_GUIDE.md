# Testing Guide - Health Assessment & Voice Features

## 🧪 Quick Testing Checklist

### 1. Backend Services Test

#### Start Backend Server
```bash
cd backend
python -m uvicorn main:app --reload
```

**Expected Output:**
```
✅ MediDoctor API Started
📚 API Docs: http://localhost:8000/api/docs
⚠️  PROTOTYPE ONLY - Not for medical use
```

#### Test API Endpoints

**Test Health Assessment:**
```bash
curl -X POST "http://localhost:8000/api/health-assessment" \
  -H "Content-Type: application/json" \
  -d '{
    "pain_level": "moderate",
    "swelling": "mild",
    "duration": "1-2 days",
    "affected_area": "knee",
    "movement_difficulty": "moderate",
    "redness": "yes",
    "warmth": "no"
  }'
```

**Test Chat Service:**
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have severe pain in my knee"
  }'
```

**Test Chat History:**
```bash
curl -X GET "http://localhost:8000/api/chat/history"
```

### 2. Frontend Test

#### Start Frontend Server
```bash
cd medidoctor
npm install  # if not already done
npm run dev
```

**Expected:** Server running at http://localhost:3000

#### Test Flow 1: Question-Based Assessment

1. ✅ Navigate to http://localhost:3000
2. ✅ Click "Know Your Health" button (green button)
3. ✅ Select "Answer Questions" mode
4. ✅ Answer all 6 questions:
   - Question 1: Select pain level
   - Question 2: Select swelling severity
   - Question 3: Select duration
   - Question 4: Select affected area
   - Question 5: Select movement difficulty
   - Question 6: Answer inflammatory signs (redness & warmth)
5. ✅ Click "Analyze with AI"
6. ✅ Verify results page shows:
   - Risk level (colored banner)
   - Risk score with progress bar
   - Risk factors list
   - Possible conditions
   - Recommendations
   - Treatment guidance

#### Test Flow 2: Voice-Based Assessment

1. ✅ Navigate to http://localhost:3000
2. ✅ Click "Know Your Health" button
3. ✅ Select "Voice Input" mode
4. ✅ **Option A - Record Voice:**
   - Click "Start Recording"
   - Allow microphone permission
   - Speak for 10-15 seconds describing symptoms
   - Click "Stop Recording"
   - Verify audio playback appears
5. ✅ **Option B - Upload Audio:**
   - Click "Upload Audio File"
   - Select a WAV/MP3 file
   - Verify audio appears
6. ✅ Click "Analyze Voice Input with AI"
7. ✅ Verify results page shows complete analysis

#### Test Flow 3: Navigation Integration

1. ✅ Navigate to http://localhost:3000/scan
2. ✅ Verify green "Know Your Health" button appears below upload area
3. ✅ Click it and verify redirect to health assessment page

### 3. Feature-Specific Tests

#### Voice Recorder Component
- ✅ Browser permission request appears
- ✅ Recording timer shows and counts
- ✅ Recording indicator (red dot) animates
- ✅ Stop button appears during recording
- ✅ Audio playback preview works
- ✅ File upload alternative works
- ✅ Supported formats: .wav, .mp3, .m4a, .ogg, .webm

#### Health Assessment Analysis
- ✅ Different pain levels produce different risk scores
- ✅ Severe symptoms trigger HIGH risk level
- ✅ Urgency level changes based on risk
- ✅ Recommendations are contextual
- ✅ Treatment guidance includes all sections:
  - Immediate care
  - Medications (OTC)
  - Activities
  - Warning signs

#### Progress Tracking
- ✅ Question counter shows (1 of 6, 2 of 6, etc.)
- ✅ Progress bar fills appropriately
- ✅ "Previous" button disabled on first question
- ✅ "Next" button disabled until question answered
- ✅ Final question shows "Analyze with AI" button

### 4. Error Handling Tests

#### Invalid Input Tests
1. ✅ Try to proceed without answering a question
   - **Expected:** Next button remains disabled
2. ✅ Upload unsupported audio format (.txt file)
   - **Expected:** Error message appears
3. ✅ Test with backend offline
   - **Expected:** "Analysis failed" alert appears

#### Edge Cases
1. ✅ Select "severe" for all questions
   - **Expected:** HIGH risk, immediate urgency
2. ✅ Select "mild" for all questions
   - **Expected:** LOW risk, routine urgency
3. ✅ Mix of moderate responses
   - **Expected:** MEDIUM risk, same-day urgency

### 5. UI/UX Tests

#### Responsive Design
- ✅ Desktop view (1920x1080)
- ✅ Tablet view (768x1024)
- ✅ Mobile view (375x667)
- ✅ All buttons accessible
- ✅ Text readable at all sizes

#### Visual Feedback
- ✅ Loading spinner appears during analysis
- ✅ Risk level colors correct:
  - LOW = Green
  - MEDIUM = Orange
  - HIGH = Red
- ✅ Hover states on buttons work
- ✅ Disabled states visible

#### User Flow
- ✅ Back button returns to home
- ✅ "Find Doctors" button navigates correctly
- ✅ "New Assessment" button resets form
- ✅ Mode switching (Questions ↔ Voice) works
- ✅ Disclaimers visible on all relevant pages

### 6. Integration Tests

#### Database Storage
1. ✅ Complete health assessment
2. ✅ Navigate to http://localhost:8000/api/admin/stats
3. ✅ Verify total_scans incremented
4. ✅ Verify recent_scans includes new entry

#### API Documentation
1. ✅ Navigate to http://localhost:8000/api/docs
2. ✅ Verify new endpoints appear:
   - POST /api/health-assessment
   - POST /api/voice-analysis
   - POST /api/chat
   - GET /api/chat/history
3. ✅ Test endpoints directly from Swagger UI

### 7. Voice Service Simulation Test

Since voice-to-text is simulated, verify:
- ✅ Different audio file sizes produce different transcriptions
- ✅ Extracted information is realistic
- ✅ Pain level, swelling, area are detected
- ✅ Analysis uses extracted data correctly

### 8. Chat Service Test

#### Test Chat Intents
```bash
# Test greeting
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'

# Test pain query
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have pain in my knee"}'

# Test urgency query
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "Is this an emergency?"}'
```

**Verify:**
- ✅ Correct intent detected
- ✅ Appropriate response generated
- ✅ Follow-up questions relevant
- ✅ Entities extracted correctly

### 9. Performance Tests

#### Load Time
- ✅ Home page loads < 2s
- ✅ Health assessment page loads < 2s
- ✅ Analysis completes < 3s
- ✅ Voice analysis completes < 4s

#### Resource Usage
- ✅ No memory leaks during recording
- ✅ Audio files cleanup properly
- ✅ No console errors
- ✅ No network request failures

### 10. Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (primary)
- ✅ Firefox
- ✅ Safari (if available)

**Voice Recording Specific:**
- ✅ Microphone permission works
- ✅ MediaRecorder API supported
- ✅ Audio playback works
- ✅ File upload fallback available

## 🎯 Test Scenarios

### Scenario 1: Urgent Case
**Setup:**
- Pain: Severe
- Swelling: Severe
- Duration: Less than 24 hours
- Movement: Unable
- Redness: Yes
- Warmth: Yes

**Expected Results:**
- Risk Level: HIGH
- Risk Score: 8-10
- Urgency: Immediate
- Recommendations include emergency care
- Warning signs prominent

### Scenario 2: Moderate Case
**Setup:**
- Pain: Moderate
- Swelling: Moderate
- Duration: 1-2 days
- Movement: Moderate
- Redness: Yes
- Warmth: No

**Expected Results:**
- Risk Level: MEDIUM
- Risk Score: 5-7
- Urgency: Same-day
- Recommendations include doctor visit within 24h

### Scenario 3: Minor Case
**Setup:**
- Pain: Mild
- Swelling: Mild
- Duration: Less than 24 hours
- Movement: Mild
- Redness: No
- Warmth: No

**Expected Results:**
- Risk Level: LOW
- Risk Score: 1-4
- Urgency: Routine
- Recommendations include home care

## 📊 Success Criteria

All features working if:
- ✅ Both input modes (questions & voice) function
- ✅ Analysis produces realistic results
- ✅ Risk levels correspond to severity
- ✅ UI is responsive and intuitive
- ✅ No console errors
- ✅ Database stores records
- ✅ Navigation flows smoothly
- ✅ Disclaimers always visible
- ✅ Error handling graceful
- ✅ Performance acceptable

## 🐛 Common Issues & Solutions

### Issue: Microphone not working
**Solution:** Check browser permissions, use HTTPS in production

### Issue: "Analysis failed" error
**Solution:** Verify backend is running, check console for details

### Issue: Voice recording not stopping
**Solution:** Refresh page, check MediaRecorder browser support

### Issue: Styles not loading
**Solution:** Run `npm run dev` in medidoctor folder

### Issue: Database errors
**Solution:** Delete database file and restart backend to recreate

## ✅ Final Verification

Run through this complete flow:
1. Start backend (`uvicorn main:app --reload`)
2. Start frontend (`npm run dev`)
3. Test question-based assessment
4. Test voice-based assessment
5. Verify results display correctly
6. Check admin stats updated
7. Test navigation between pages
8. Verify no errors in console

**If all steps pass, the implementation is successful!** 🎉
