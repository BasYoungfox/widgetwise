const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// All routes require auth
router.use(authMiddleware);

// List user's chatbots
router.get('/', async (req, res) => {
  try {
    const chatbots = await prisma.chatbot.findMany({
      where: { userId: req.userId },
      include: { _count: { select: { conversations: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(chatbots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create chatbot
router.post('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (user.plan === 'free') {
      return res.status(403).json({ error: 'Upgrade to Premium to create a chatbot' });
    }

    const chatbotCount = await prisma.chatbot.count({ where: { userId: req.userId } });
    if (chatbotCount >= 1) {
      return res.status(403).json({ error: 'Premium plan is limited to 1 chatbot' });
    }

    const { name, systemPrompt, welcomeMessage, primaryColor, businessInfo } = req.body;
    if (!name || !systemPrompt) {
      return res.status(400).json({ error: 'Name and system prompt are required' });
    }

    const chatbot = await prisma.chatbot.create({
      data: {
        userId: req.userId,
        name,
        systemPrompt,
        welcomeMessage: welcomeMessage || 'Hello! How can I help you?',
        primaryColor: primaryColor || '#2563eb',
        ...(businessInfo !== undefined && { businessInfo }),
      },
    });
    res.status(201).json(chatbot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single chatbot
router.get('/:id', async (req, res) => {
  try {
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found' });
    res.json(chatbot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update chatbot
router.put('/:id', async (req, res) => {
  try {
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found' });

    const { name, systemPrompt, welcomeMessage, primaryColor, businessInfo } = req.body;
    const updated = await prisma.chatbot.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(systemPrompt && { systemPrompt }),
        ...(welcomeMessage !== undefined && { welcomeMessage }),
        ...(primaryColor && { primaryColor }),
        ...(businessInfo !== undefined && { businessInfo }),
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete chatbot
router.delete('/:id', async (req, res) => {
  try {
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found' });

    await prisma.chatbot.delete({ where: { id: req.params.id } });
    res.json({ message: 'Chatbot deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get usage stats (messages this month)
router.get('/usage/stats', async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const messageCount = await prisma.message.count({
      where: {
        conversation: { chatbot: { userId: req.userId } },
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    });

    res.json({
      used: messageCount,
      limit: 1000,
      resetDate: monthEnd.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get embed code
router.get('/:id/embed', async (req, res) => {
  try {
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found' });

    const serverUrl = `${req.protocol}://${req.get('host')}`;
    const embed = `<script src="${serverUrl}/widget/widget.min.js"\n  data-chatbot-id="${chatbot.id}"\n  data-server="${serverUrl}">\n</script>`;
    res.json({ embed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
