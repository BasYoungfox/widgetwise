const express = require('express');
const { PrismaClient } = require('@prisma/client');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();
const prisma = new PrismaClient();

router.use(adminMiddleware);

// List all users with chatbot counts
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        messageLimit: true,
        createdAt: true,
        _count: { select: { chatbots: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single user with full details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        messageLimit: true,
        createdAt: true,
        chatbots: {
          select: {
            id: true,
            name: true,
            primaryColor: true,
            createdAt: true,
            _count: { select: { conversations: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Count messages this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const messagesThisMonth = await prisma.message.count({
      where: {
        conversation: { chatbot: { userId: user.id } },
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    });

    const totalMessages = await prisma.message.count({
      where: {
        conversation: { chatbot: { userId: user.id } },
      },
    });

    res.json({ ...user, messagesThisMonth, totalMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle user plan
router.patch('/users/:id/plan', async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['free', 'premium'].includes(plan)) {
      return res.status(400).json({ error: 'Plan must be "free" or "premium"' });
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { plan },
      select: { id: true, plan: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update message limit
router.patch('/users/:id/message-limit', async (req, res) => {
  try {
    const { messageLimit } = req.body;
    if (typeof messageLimit !== 'number' || messageLimit < 0) {
      return res.status(400).json({ error: 'messageLimit must be a non-negative number' });
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { messageLimit },
      select: { id: true, messageLimit: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset usage (delete current month's messages)
router.post('/users/:id/reset-usage', async (req, res) => {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const deleted = await prisma.message.deleteMany({
      where: {
        conversation: { chatbot: { userId: req.params.id } },
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    });
    res.json({ success: true, deletedCount: deleted.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user account
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
