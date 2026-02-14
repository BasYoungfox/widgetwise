const express = require('express');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');
const { getChatResponse } = require('../services/openai');

const router = express.Router();
const prisma = new PrismaClient();

// Rate limit: 20 messages per minute per session
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.body.sessionId || req.ip,
  message: { error: 'Too many messages, please slow down' },
});

// Get chatbot config (public, used by widget)
router.get('/:chatbotId/config', async (req, res) => {
  try {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: req.params.chatbotId },
      select: { name: true, welcomeMessage: true, primaryColor: true },
    });
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found' });
    res.json(chatbot);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message (public)
router.post('/:chatbotId', chatLimiter, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    const chatbot = await prisma.chatbot.findUnique({
      where: { id: req.params.chatbotId },
    });
    if (!chatbot) return res.status(404).json({ error: 'Chatbot not found' });

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { chatbotId: chatbot.id, sessionId },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { chatbotId: chatbot.id, sessionId },
      });
    }

    // Save user message
    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message },
    });

    // Get conversation history
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 20, // limit context window
    });

    const messages = history.map((m) => ({ role: m.role, content: m.content }));

    // Build system prompt with business info if available
    let systemPrompt = chatbot.systemPrompt;
    if (chatbot.businessInfo) {
      systemPrompt += "\n\nBusiness Information:\n" + chatbot.businessInfo;
    }

    // Get AI response
    const aiResponse = await getChatResponse(systemPrompt, messages);

    // Save assistant message
    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: aiResponse },
    });

    res.json({ response: aiResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

module.exports = router;
