# CV Portfolio Visitor Tracker Backend

A simple Express.js backend for tracking unique visitors to your CV portfolio.

## Features

- ✅ Track unique visitors using device fingerprints
- ✅ Count total views
- ✅ CORS enabled for cross-origin requests
- ✅ Health check endpoint
- ✅ Stats API endpoint

## Setup

### Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

4. **Test the API**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/stats
   ```

### Deploy on Render

1. **Create a GitHub repository** for this backend code
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/cv-backend.git
   git push -u origin main
   ```

2. **Go to Render.com**
   - Sign up / Log in
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select the `cv-backend` repo

3. **Configure the service**
   - **Name**: `cv-visitor-tracker`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if you want always-on)

4. **Deploy**
   - Click **"Create Web Service"**
   - Render will automatically deploy your backend
   - You'll get a URL like: `https://cv-visitor-tracker.onrender.com`

## API Endpoints

### POST `/api/track-visitor`

Track a new or returning visitor.

**Request:**
```json
{
  "fingerprint": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

**Response:**
```json
{
  "success": true,
  "uniqueVisitors": 42,
  "totalViews": 128,
  "isNewVisitor": true
}
```

### GET `/api/stats`

Get current visitor statistics.

**Response:**
```json
{
  "uniqueVisitors": 42,
  "totalViews": 128,
  "timestamp": "2025-01-17T20:00:00.000Z"
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

## Frontend Integration

Update your portfolio's `index.html` to use this backend:

```javascript
const BACKEND_URL = 'https://cv-visitor-tracker.onrender.com';

async function trackVisitor() {
  try {
    const fingerprint = await generateDeviceFingerprint();
    
    const response = await fetch(`${BACKEND_URL}/api/track-visitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fingerprint })
    });
    
    const data = await response.json();
    animateCounter(data.uniqueVisitors);
    console.log(`📊 Unique visitors: ${data.uniqueVisitors}`);
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}
```

## Notes

- Data is stored **in-memory** (resets when server restarts)
- For persistent storage, upgrade to use PostgreSQL on Render
- Free tier on Render may have cold starts (takes ~30 seconds to wake up after inactivity)
- For production, consider upgrading to a paid plan for always-on service

## License

MIT
