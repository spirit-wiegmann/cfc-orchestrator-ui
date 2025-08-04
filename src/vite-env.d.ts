// Für Vite Umgebungsvariablen
interface ImportMetaEnv {
  readonly VITE_GITHUB_CLIENT_ID: string;
  readonly VITE_REDIRECT_URI: string;
  readonly VITE_ORCHESTRATOR_REPO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
