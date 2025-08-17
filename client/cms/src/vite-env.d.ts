interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_COOKIE_KEY_SECRET: string;
  readonly VITE_WHISHLIST_URL: string;
  readonly VITE_PANORAMA_URL: string;
  readonly VITE_PLAYLIST_URL: string;
  readonly VITE_EQUIPMENT_URL: string;
  readonly VITE_COUPON_URL: string;
  readonly VITE_QA_URL: string;
  readonly VITE_PROFILE_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_SUPPORT_LANGUAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
