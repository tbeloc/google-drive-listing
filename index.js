// Chargement des variables d'environnement depuis le fichier .env
require('dotenv').config();
const { google } = require('googleapis');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Classe principale pour lister et analyser les fichiers Google Drive
 * Gère l'authentification, la récupération des données et l'export
 */
class GoogleDriveLister {
    /**
     * Initialise une nouvelle instance avec les configurations OAuth2
     * et crée le client Google Drive API
     */
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        );
        this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
        this.results = [];
    }

    /**
     * Gère l'authentification OAuth2 avec Google
     * Utilise un token existant ou en génère un nouveau
     * @returns {Promise<void>}
     */
    async authenticate() {
        if (fs.existsSync('token.json')) {
            const token = JSON.parse(fs.readFileSync('token.json'));
            this.oauth2Client.setCredentials(token);
            return;
        }

        const authUrl = this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive.readonly']
        });
        
        console.log('Veuillez vous authentifier en visitant cette URL:', authUrl);
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const code = await new Promise((resolve) => {
            rl.question('Entrez le code reçu après authentification : ', (code) => {
                rl.close();
                resolve(code);
            });
        });

        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            fs.writeFileSync('token.json', JSON.stringify(tokens));
            console.log('Token sauvegardé avec succès!');
        } catch (err) {
            console.error('Erreur lors de l\'obtention du token:', err);
            throw err;
        }
    }

    /**
     * Liste récursivement tous les fichiers et dossiers dans Google Drive
     * @param {string} folderId - ID du dossier à analyser (default: 'root')
     * @param {string} parentPath - Chemin parent pour la construction du chemin complet
     * @returns {Promise<void>}
     */
    async listFilesAndFolders(folderId = 'root', parentPath = '') {
        try {
            // Récupère la liste des fichiers dans le dossier courant
            const res = await this.drive.files.list({
                q: `'${folderId}' in parents and trashed = false`,
                fields: 'files(id, name, mimeType, owners, permissions, modifiedTime, shared)',
                pageSize: 1000
            });

            for (const file of res.data.files) {
                const currentPath = parentPath ? `${parentPath}/${file.name}` : file.name;
                
                // Récupère les détails des permissions pour chaque fichier
                const permDetails = await this.drive.permissions.list({
                    fileId: file.id,
                    fields: 'permissions(emailAddress,role,type)'
                });

                // Analyse les permissions
                const permissions = permDetails.data.permissions.map(perm => ({
                    email: perm.emailAddress || 'N/A',
                    role: perm.role,
                    type: perm.type
                }));

                // Vérifie si le fichier est partagé en externe
                const isExternal = permissions.some(p => p.type === 'user' && !p.email.includes('@votredomaine.com'));

                // Ajoute les informations du fichier aux résultats
                this.results.push({
                    path: currentPath,
                    type: file.mimeType === 'application/vnd.google-apps.folder' ? 'Dossier' : 'Fichier',
                    owner: file.owners?.[0]?.emailAddress || 'N/A',
                    permissions: permissions.map(p => `${p.email} (${p.role})`).join('; '),
                    external_sharing: isExternal ? 'Oui' : 'Non',
                    last_modified: new Date(file.modifiedTime).toLocaleDateString('fr-FR')
                });

                // Si c'est un dossier, analyse récursivement son contenu
                if (file.mimeType === 'application/vnd.google-apps.folder') {
                    await this.listFilesAndFolders(file.id, currentPath);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la lecture des fichiers:', error);
        }
    }

    /**
     * Exporte les résultats dans un fichier CSV
     * @returns {Promise<void>}
     */
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

/**
 * Point d'entrée principal du script
 * Initialise le listeur, authentifie et lance l'analyse
 */
async function main() {
    const lister = new GoogleDriveLister();
    await lister.authenticate();
    await lister.listFilesAndFolders();
    await lister.exportToCSV();
}

main().catch(console.error);
