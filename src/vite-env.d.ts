/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add other env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

// Declare image file extensions as valid imports
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';

// Declare audio file extensions as valid imports
declare module '*.mp3';
declare module '*.wav';
declare module '*.ogg';
declare module '*.webm';
declare module '*.aac';
declare module '*.flac';
