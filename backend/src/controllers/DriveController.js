const GoogleDriveService = require('../services/GoogleDriveService');
const AuthService = require('../services/AuthService');
const { createObjectCsvWriter } = require('csv-writer');

class DriveController {
    constructor() {
        this.authService = new AuthService();
    }

    async getAuthUrl(req, res) {
        try {
            const authUrl = this.authService.generateAuthUrl();
            res.json({ url: authUrl });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async handleCallback(req, res) {
        try {
            const { code } = req.query;
            const oauth2Client = await this.authService.handleCallback(code);
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listFiles(req, res) {
        try {
            const oauth2Client = await this.authService.authenticate();
            const driveService = new GoogleDriveService(oauth2Client);
            const files = await driveService.listFilesAndFolders();
            res.json(files);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async exportToCsv(req, res) {
        try {
            const oauth2Client = await this.authService.authenticate();
            const driveService = new GoogleDriveService(oauth2Client);
            const files = await driveService.listFilesAndFolders();

            const csvWriter = createObjectCsvWriter({
                path: 'drive_listing.csv',
                header: [
                    { id: 'path', title: 'Chemin' },
                    { id: 'type', title: 'Type' },
                    { id: 'owner', title: 'Propriétaire' },
                    { id: 'permissions', title: 'Permissions' },
                    { id: 'external_sharing', title: 'Partage Externe' },
                    { id: 'last_modified', title: 'Dernière Modification' }
                ],
                encoding: 'utf8'
            });

            await csvWriter.writeRecords(files);
            res.download('drive_listing.csv');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DriveController;
