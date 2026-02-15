require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const chatbotRoutes = require('./routes/chatbots');
const chatRoutes = require('./routes/chat');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: allow any origin on /api/chat (widget requests), restrict others
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use('/api/chat', cors());
app.use(cors({ origin: clientOrigin, credentials: true }));

app.use(express.json());

// Serve widget static files
app.use('/widget', express.static(path.join(__dirname, '../../widget/dist')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbots', chatbotRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Serve client in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
