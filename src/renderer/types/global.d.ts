// კოდერი — Window API ტიპების დეკლარაცია

interface AuthResult {
  success: boolean;
  error?: string;
  user?: { name: string; username: string };
}

interface ProjectListResult {
  success: boolean;
  error?: string;
  projects?: { name: string; createdAt: number }[];
}

interface FsListResult {
  success: boolean;
  error?: string;
  files?: { name: string; isDir: boolean }[];
}

interface FsReadResult {
  success: boolean;
  error?: string;
  content?: string;
}

interface FsResult {
  success: boolean;
  error?: string;
}

interface RunFrontendResult {
  success: boolean;
  error?: string;
  url?: string;
}

interface KoderiAPI {
  platform: string;
  auth: {
    register: (data: { name: string; username: string; password: string }) => Promise<AuthResult>;
    login: (data: { username: string; password: string }) => Promise<AuthResult>;
    clearAll: () => Promise<{ success: boolean }>;
  };
  project: {
    list: (mode: string, username?: string) => Promise<ProjectListResult>;
    create: (mode: string, projectName: string, username?: string) => Promise<FsResult>;
    delete: (mode: string, projectName: string, username?: string) => Promise<FsResult>;
  };
  fs: {
    list: (mode: string, projectName: string, username?: string) => Promise<FsListResult>;
    read: (mode: string, projectName: string, fileName: string, username?: string) => Promise<FsReadResult>;
    write: (mode: string, projectName: string, fileName: string, content: string, username?: string) => Promise<FsResult>;
    delete: (mode: string, projectName: string, fileName: string, username?: string) => Promise<FsResult>;
  };
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
  update: {
    check: () => Promise<void>;
    download: () => Promise<void>;
    install: () => Promise<void>;
    onChecking: (cb: () => void) => void;
    onAvailable: (cb: (version: string) => void) => void;
    onNotAvailable: (cb: () => void) => void;
    onProgress: (cb: (percent: number) => void) => void;
    onDownloaded: (cb: () => void) => void;
    onError: (cb: (msg: string) => void) => void;
  };
  run: {
    frontend: (projectName: string, username?: string) => Promise<RunFrontendResult>;
    stop: () => Promise<FsResult>;
    python: (projectName: string, fileName: string, username?: string) => Promise<FsResult>;
    pythonStop: () => Promise<FsResult>;
    onStdout: (cb: (data: string) => void) => void;
    onStderr: (cb: (data: string) => void) => void;
    onExit: (cb: (code: number) => void) => void;
    removeAllListeners: () => void;
  };
}

declare global {
  interface Window {
    koderiAPI: KoderiAPI;
  }
}

export {};
