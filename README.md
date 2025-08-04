# CFC Orchestrator UI

Eine React-basierte Benutzeroberfläche für den CFC Orchestrator mit Material UI, die es ermöglicht, MonoRepo-Orchestrierungsprozesse direkt über eine GitHub Page zu starten.

## Features

- 🔐 **GitHub OAuth Integration** für sicheren API-Zugriff
- 🔍 **Repository-Suche** mit Autovervollständigung
- 📋 **Konfigurationsformular** für MonoRepo-Erstellung
- 🚀 **API-Integration** mit dem CFC Orchestrator Workflow
- 🎨 **Material UI Design** für moderne Benutzeroberfläche

## Technologien

- **React.js**: Frontend-Framework
- **Vite**: Build-Tool und Entwicklungsserver
- **Material UI**: UI-Komponenten
- **GitHub API v4**: GraphQL API für Repository-Suche
- **GitHub REST API**: Für Workflow-Dispatch
- **OAuth 2.0**: Für sichere Authentifizierung

## Installation

```bash
# Repository klonen
git clone https://github.com/spirit-wiegmann/cfc-orchestrator-ui.git
cd cfc-orchestrator-ui

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Konfiguration

Die Anwendung benötigt die folgenden Umgebungsvariablen:

```
VITE_GITHUB_CLIENT_ID=deine_client_id
VITE_REDIRECT_URI=https://deine-github-page.github.io/callback
VITE_ORCHESTRATOR_REPO=spirit-wiegmann/cfc-orchestrator
```

Erstelle eine Datei `.env.local` im Stammverzeichnis des Projekts mit diesen Werten.

## Nutzung

1. Öffne die GitHub Page
2. Authentifiziere dich mit deinem GitHub-Konto
3. Suche nach Repositories, die du in ein MonoRepo integrieren möchtest
4. Konfiguriere die MonoRepo-Einstellungen
5. Starte den Workflow-Prozess

## GitHub App-Berechtigungen

Die GitHub App benötigt die folgenden OAuth-Scopes:

- `repo`: Für Zugriff auf private Repositories (falls erforderlich)
- `workflow`: Zum Auslösen des Orchestrator-Workflows
- `read:org`: Für Zugriff auf Organisationsrepositories (falls erforderlich)

## Deployment

Die Anwendung wird automatisch auf GitHub Pages deployt, wenn Änderungen in den `main`-Branch gepusht werden. Siehe die GitHub Actions-Konfiguration für Details.

## Entwicklung

```bash
# ESLint ausführen
npm run lint

# Vite-Vorschau starten
npm run preview

# Produktionsbuild erstellen
npm run build
```

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.
