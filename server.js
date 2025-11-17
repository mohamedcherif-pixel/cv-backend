const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory visitor storage
// In production, use a database like PostgreSQL
const visitors = {};
let totalViews = 0;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Track visitor endpoint
app.post('/api/track-visitor', (req, res) => {
  try {
    const { fingerprint } = req.body;

    if (!fingerprint) {
      return res.status(400).json({ error: 'Fingerprint is required' });
    }

    const now = new Date().toISOString();

    // Check if visitor exists
    if (!visitors[fingerprint]) {
      // New unique visitor
      visitors[fingerprint] = {
        firstVisit: now,
        lastVisit: now,
        visitCount: 1
      };
      console.log(`🆕 New unique visitor: ${fingerprint.substring(0, 8)}...`);
    } else {
      // Returning visitor
      visitors[fingerprint].lastVisit = now;
      visitors[fingerprint].visitCount++;
      console.log(`🔄 Returning visitor: ${fingerprint.substring(0, 8)}...`);
    }

    totalViews++;

    // Get unique visitor count
    const uniqueVisitors = Object.keys(visitors).length;

    res.json({
      success: true,
      uniqueVisitors,
      totalViews,
      isNewVisitor: !visitors[fingerprint] || visitors[fingerprint].visitCount === 1
    });

    console.log(`📊 Total unique visitors: ${uniqueVisitors} | Total views: ${totalViews}`);
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stats endpoint
app.get('/api/stats', (req, res) => {
  try {
    const uniqueVisitors = Object.keys(visitors).length;
    res.json({
      uniqueVisitors,
      totalViews,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Visitor tracker backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
});
