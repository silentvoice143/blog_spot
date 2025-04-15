interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // Add more env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
