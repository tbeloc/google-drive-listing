# Google Drive Listing Script

Ce script permet de lister tous les fichiers, dossiers et leurs permissions dans Google Drive pour faciliter la migration vers les Drives partagés.

## Fonctionnalités

- Liste récursive des fichiers et dossiers
- Extraction des permissions (lecture, écriture, commentaire)
- Identification des partages externes
- Export au format CSV avec les informations suivantes :
  - Chemin du fichier/dossier
  - Type (Dossier/Fichier)
  - Propriétaire
  - Permissions
  - Partage externe
  - Date de dernière modification

## Prérequis

- Node.js (v14 ou supérieur)
- Un projet Google Cloud Platform avec l'API Drive activée
- Des identifiants OAuth 2.0 (Client ID et Client Secret)

## Installation

1. Clonez ce dépôt
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```
4. Configurez vos identifiants Google dans le fichier `.env`

## Configuration Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Drive
4. Créez des identifiants OAuth 2.0
5. Ajoutez l'URI de redirection : `http://localhost:3000/oauth2callback`
6. Copiez le Client ID et le Client Secret dans votre fichier `.env`

## Utilisation

1. Lancez le script :
   ```bash
   npm start
   ```
2. Suivez le lien d'authentification qui s'affiche dans la console
3. Autorisez l'application à accéder à votre Google Drive
4. Le script générera un fichier `drive_listing.csv` avec toutes les informations

## Format du fichier de sortie

Le fichier CSV généré contient les colonnes suivantes :
- Chemin : chemin complet du fichier/dossier
- Type : Dossier ou Fichier
- Propriétaire : adresse email du propriétaire
- Permissions : liste des permissions (email et rôle)
- Partage Externe : Oui/Non
- Dernière Modification : date de dernière modification
