const AuthService = require('../services/AuthService');

const authMiddleware = async (req, res, next) => {
    try {
        const authService = new AuthService();
        await authService.authenticate();
        next();
    } catch (error) {
        res.status(401).json({ error: 'Non authentifié' });
    }
};

module.exports = authMiddleware;
