declare global {
  interface Window {
    _env_?: any;
  }
}

// Used in encyrpting and decrypting the token from local storage.
export const TOKEN_ENCRYPTION_KEY = window._env_?.REACT_APP_TOKEN_ENCRYPTION_KEY ?? "8f4a4e01b639aa73d2b5bdb6e9f2e6aef471b3dbba3d5e48e3a798fc3d6d6cbb";