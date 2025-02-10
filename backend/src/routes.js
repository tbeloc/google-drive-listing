const express = require('express');
const DriveController = require('./controllers/DriveController');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();
const driveController = new DriveController();

// Routes publiques
router.get('/auth-url', (req, res) => driveController.getAuthUrl(req, res));
router.get('/oauth2callback', (req, res) => driveController.handleCallback(req, res));

// Routes protégées
router.get('/files', authMiddleware, (req, res) => driveController.listFiles(req, res));
router.get('/export-csv', authMiddleware, (req, res) => driveController.exportToCsv(req, res));

module.exports = router;
