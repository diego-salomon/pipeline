/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE?: 'demo' | 'live'
  readonly VITE_DEMO_PASSWORD?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_CALL_TRANSCRIBE_URL?: string
  readonly VITE_CALL_ANALYZE_URL?: string
  readonly VITE_CALL_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
