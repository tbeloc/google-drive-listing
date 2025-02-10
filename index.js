require('dotenv').config();
const { google } = require('googleapis');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');

class GoogleDriveLister {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );
        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
        this.results = [];
    }

    async authenticate() {
        if (fs.existsSync('token.json')) {
            const token = JSON.parse(fs.readFileSync('token.json'));
            this.oauth2Client.setCredentials(token);
        } else {
            const authUrl = this.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/drive.readonly']
            });
            console.log('Veuillez vous authentifier en visitant cette URL:', authUrl);
            // Attendre que l'utilisateur s'authentifie et obtienne le code
            // Cette partie nécessite une interaction manuelle
        }
    }

    async listFilesAndFolders(folderId = 'root', parentPath = '') {
        try {
            const res = await this.drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, owners, permissions, modifiedTime, shared)',
                pageSize: 1000
            });

            for (const file of res.data.files) {
                const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
                
                // Obtenir les détails des permissions
                const permDetails = await this.drive.permissions.list({
                    fileId: file.id,
                    fields: 'permissions(emailAddress,role,type)'
                });

                const permissions = permDetails.data.permissions.map(perm => ({
                    email: perm.emailAddress || 'N/A',
                    role: perm.role,
                    type: perm.type
                }));

                const isExternal = permissions.some(p => p.type === 'user' && !p.email.includes('@votredomaine.com'));

                this.results.push({
                    path: currentPath,
                    type: file.mimeType === 'application/vnd.google-apps.folder' ? 'Dossier' : 'Fichier',
                    owner: file.owners?.[0]?.emailAddress || 'N/A',
                    permissions: permissions.map(p => `${p.email} (${p.role})`).join('; '),
                    external_sharing: isExternal ? 'Oui' : 'Non',
                    last_modified: new Date(file.modifiedTime).toLocaleDateString('fr-FR')
                });

                if (file.mimeType === 'application/vnd.google-apps.folder') {
                    await this.listFilesAndFolders(file.id, currentPath);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la lecture des fichiers:', error);
        }
    }

    async exportToCSV() {
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

        await csvWriter.writeRecords(this.results);
        console.log('Export CSV terminé avec succès!');
    }
}

async function main() {
    const lister = new GoogleDriveLister();
    await lister.authenticate();
    await lister.listFilesAndFolders();
    await lister.exportToCSV();
}

main().catch(console.error);
