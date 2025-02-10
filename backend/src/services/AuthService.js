const { google } = require('googleapis');
const fs = require('fs');

class AuthService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );
    }

    async authenticate() {
        if (fs.existsSync('token.json')) {
            const token = JSON.parse(fs.readFileSync('token.json'));
            this.oauth2Client.setCredentials(token);
            return this.oauth2Client;
        }

        throw new Error('Token non trouvé. Veuillez vous authentifier.');
    }

    generateAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive.readonly']
        });
    }

    async handleCallback(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            fs.writeFileSync('token.json', JSON.stringify(tokens));
            return this.oauth2Client;
        } catch (err) {
            console.error('Erreur lors de l\'obtention du token:', err);
            throw err;
        }
    }

    getOAuth2Client() {
        return this.oauth2Client;
    }
}

module.exports = AuthService;
