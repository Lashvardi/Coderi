// კოდერი — Window API ტიპების დეკლარაცია
// preload.ts-ით გამოტანილი API-ს ტიპები

interface AuthResult {
  success: boolean;
  error?: string;
  user?: { name: string; username: string };
}

interface KoderiAPI {
  platform: string;
  auth: {
    register: (data: { name: string; username: string; password: string }) => Promise<AuthResult>;
    login: (data: { username: string; password: string }) => Promise<AuthResult>;
    clearAll: () => Promise<{ success: boolean }>;
  };
}

declare global {
  interface Window {
    koderiAPI: KoderiAPI;
  }
}

export {};
