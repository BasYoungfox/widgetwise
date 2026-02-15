const prisma = require('../lib/prisma');
const authMiddleware = require('./auth');

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, async () => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user || user.email !== 'bas@jongevos.com') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
}

module.exports = adminMiddleware;
