const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/:chatbotId', async (req, res) => {
  try {
    // Verify ownership
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: req.params.chatbotId, userId: req.userId },
    });
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found' });

    // Total conversations
    const totalConversations = await prisma.conversation.count({
      where: { chatbotId: chatbot.id },
    });

    // Total messages
    const totalMessages = await prisma.message.count({
      where: { conversation: { chatbotId: chatbot.id } },
    });

    // Messages per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const messagesPerDay = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "Message"
      WHERE "conversationId" IN (
        SELECT id FROM "Conversation" WHERE "chatbotId" = ${chatbot.id}
      )
      AND "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    res.json({ totalConversations, totalMessages, messagesPerDay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
