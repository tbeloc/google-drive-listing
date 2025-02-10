const { google } = require('googleapis');
const fs = require('fs');

class GoogleDriveService {
    constructor(oauth2Client) {
        this.drive = google.drive({ version: 'v3', auth: oauth2Client });
        this.results = [];
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
                
                const permDetails = await this.getFilePermissions(file.id);
                const permissions = this.parsePermissions(permDetails.data.permissions);
                const isExternal = this.checkExternalSharing(permissions);

                this.results.push({
                    path: currentPath,
                    type: this.getFileType(file.mimeType),
                    owner: file.owners?.[0]?.emailAddress || 'N/A',
                    permissions: this.formatPermissions(permissions),
                    external_sharing: isExternal ? 'Oui' : 'Non',
                    last_modified: new Date(file.modifiedTime).toLocaleDateString('fr-FR')
                });

                if (this.isFolder(file.mimeType)) {
                    await this.listFilesAndFolders(file.id, currentPath);
                }
            }

            return this.results;
        } catch (error) {
            console.error('Erreur lors de la lecture des fichiers:', error);
            throw error;
        }
    }

    async getFilePermissions(fileId) {
        return this.drive.permissions.list({
            fileId: fileId,
            fields: 'permissions(emailAddress,role,type)'
        });
    }

    parsePermissions(permissions) {
        return permissions.map(perm => ({
            email: perm.emailAddress || 'N/A',
            role: perm.role,
            type: perm.type
        }));
    }

    checkExternalSharing(permissions) {
        return permissions.some(p => p.type === 'user' && !p.email.includes('@votredomaine.com'));
    }

    formatPermissions(permissions) {
        return permissions.map(p => `${p.email} (${p.role})`).join('; ');
    }

    getFileType(mimeType) {
        return mimeType === 'application/vnd.google-apps.folder' ? 'Dossier' : 'Fichier';
    }

    isFolder(mimeType) {
        return mimeType === 'application/vnd.google-apps.folder';
    }

    clearResults() {
        this.results = [];
    }
}

module.exports = GoogleDriveService;
