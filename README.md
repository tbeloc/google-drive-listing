# Google Drive Listing

Application permettant de lister et d'analyser les fichiers, dossiers et permissions de Google Drive. Inclut une interface utilisateur React moderne et un backend Node.js.

## Fonctionnalités

- Liste récursive des fichiers et dossiers
- Extraction des permissions (lecture, écriture, commentaire)
- Identification des partages externes
- Interface utilisateur moderne avec Material-UI
- Export au format CSV

## Technologies Utilisées

- **Frontend**:
  - React 18
  - Material-UI
  - React Query
  - Axios

- **Backend**:
  - Node.js
  - Google Drive API
  - CSV Writer

## Prérequis

- Node.js (v14 ou supérieur)
- Un projet Google Cloud Platform avec l'API Drive activée
- Des identifiants OAuth 2.0 (Client ID et Client Secret)

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/tbeloc/google-drive-listing.git
   cd google-drive-listing
   ```

2. Installez les dépendances du backend :
   ```bash
   npm install
   ```

3. Installez les dépendances du frontend :
   ```bash
   cd frontend
   npm install
   ```

4. Configurez les variables d'environnement :
   ```bash
   cp .env.example .env
   # Éditez .env avec vos identifiants Google
   ```

## Démarrage

1. Démarrez le backend :
   ```bash
   npm start
   ```

2. Démarrez le frontend :
   ```bash
   cd frontend
   npm run dev
   ```

3. Ouvrez votre navigateur sur `http://localhost:5173`

## Format des Données

Le fichier CSV généré contient :
- Chemin complet du fichier/dossier
- Type (Dossier/Fichier)
- Propriétaire (email)
- Permissions détaillées
- Statut du partage externe
- Date de dernière modification

## Sécurité

- Authentification sécurisée via OAuth 2.0
- Tokens stockés localement
- Accès en lecture seule à Google Drive

## Licence

Ce projet est sous licence [GPL-3.0](LICENSE)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique des modifications.
