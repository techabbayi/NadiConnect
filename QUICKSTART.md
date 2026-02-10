# MediDoctor AI - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Clone or Download
```bash
cd MediDoctor
```

### Step 2: Start Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

✅ Backend running at http://localhost:8000

### Step 3: Start Frontend (New Terminal)

```bash
cd medidoctor
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

✅ Frontend running at http://localhost:3000

### Step 4: Test the App

1. Open http://localhost:3000
2. Click "Start Injury Scan"
3. Upload any image (name it with keywords like "cut.jpg" or "burn.jpg" for different results)
4. View AI analysis and risk assessment
5. Browse doctors and book appointment
6. Check admin dashboard at http://localhost:3000/admin

## 🔍 API Documentation

Open http://localhost:8000/api/docs for interactive Swagger UI

## 🎯 Demo Tips

### For Best Demo Results:
- Name test images: `cut.jpg`, `burn.jpg`, `swelling.jpg`, `fracture.jpg`
- Each filename triggers different injury detection
- Risk levels automatically classified
- Mock doctors pre-loaded in database

### Key Demo Features to Showcase:
1. **Real-time camera capture** (works on mobile)
2. **AI confidence meter** with visual feedback
3. **Color-coded risk levels** (🟢 🟡 🔴)
4. **Smart doctor recommendations** based on injury
5. **Complete booking flow** with token generation
6. **Admin analytics** showing usage stats

### Common Issues:

**Backend won't start?**
```bash
# Make sure you activated venv
# Windows: venv\Scripts\activate
# Then try again
python main.py
```

**Frontend can't connect to backend?**
```bash
# Check .env.local has correct URL
cat .env.local
# Should show: NEXT_PUBLIC_API_URL=http://localhost:8000

# Verify backend is running
curl http://localhost:8000
```

**Port already in use?**
```bash
# Backend: Change port in main.py (last line)
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)

# Frontend: Use different port
npm run dev -- -p 3001
```

## 📱 Mobile Testing

1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update `.env.local`: `NEXT_PUBLIC_API_URL=http://YOUR_IP:8000`
3. Access from mobile: `http://YOUR_IP:3000`
4. Camera will work natively on mobile devices

## 🎤 Pitch Presentation Tips

### Opening Statement:
"MediDoctor AI is an AI-powered triage platform that helps users assess injuries, get instant guidance, and connect with doctors — all through a simple photo scan."

### Live Demo Script:
1. Show landing page → emphasize disclaimers
2. Scan injury → showcase camera integration
3. View results → highlight AI confidence and risk classification
4. Browse doctors → show smart filtering
5. Book appointment → demonstrate complete flow
6. Open admin → prove data persistence

### Key Selling Points:
- ✅ Reduces emergency room overcrowding
- ✅ Provides immediate first-aid guidance
- ✅ Connects users with appropriate specialists
- ✅ Data-driven insights for healthcare providers
- ✅ Mobile-first design for accessibility

### Technical Highlights:
- Real-time AI analysis (mock but scalable)
- RESTful API architecture
- Responsive design (works on all devices)
- Auto-generated API documentation
- SQLite → easily upgradable to PostgreSQL

## 🚢 Production Deployment Checklist

### Backend (Render/Railway):
- [ ] Push code to GitHub
- [ ] Create Render/Railway account
- [ ] Connect repository
- [ ] Set root to `/backend`
- [ ] Deploy and copy URL

### Frontend (Vercel):
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Deploy: `cd medidoctor && vercel`
- [ ] Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`
- [ ] Redeploy if needed

### Post-Deployment:
- [ ] Test all features on live URLs
- [ ] Verify API connection
- [ ] Check mobile responsiveness
- [ ] Test camera on real devices
- [ ] Monitor errors in console

## ⚠️ Final Reminders

**ALWAYS mention in presentations:**
- This is a prototype demonstration
- Not for real medical diagnosis
- Uses simulated AI logic
- No real appointments created
- Educational purposes only

## 📞 Need Help?

Check:
1. API docs: http://localhost:8000/api/docs
2. Browser console for errors
3. Backend terminal for API logs
4. README.md for detailed info

---

**You're ready to demo! 🎉**

Break a leg in your hackathon/pitch! 🚀
