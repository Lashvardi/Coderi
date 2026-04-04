// კოდერი — Preload სკრიპტი
// ხიდი Main პროცესსა და Renderer პროცესს შორის
// contextBridge-ით უსაფრთხოდ გადავცემთ API-ს renderer-ს

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('koderiAPI', {
  platform: process.platform,

  // ავტორიზაციის API
  auth: {
    register: (data: { name: string; username: string; password: string }) =>
      ipcRenderer.invoke('auth:register', data),
    login: (data: { username: string; password: string }) =>
      ipcRenderer.invoke('auth:login', data),
    clearAll: () => ipcRenderer.invoke('auth:clearAll'),
  },

  // პროექტების API
  project: {
    list: (mode: string, username?: string) =>
      ipcRenderer.invoke('project:list', mode, username),
    create: (mode: string, projectName: string, username?: string) =>
      ipcRenderer.invoke('project:create', mode, projectName, username),
    delete: (mode: string, projectName: string, username?: string) =>
      ipcRenderer.invoke('project:delete', mode, projectName, username),
  },

  // ფაილური სისტემის API (პროექტის შიგნით)
  fs: {
    list: (mode: string, projectName: string, username?: string) =>
      ipcRenderer.invoke('fs:list', mode, projectName, username),
    read: (mode: string, projectName: string, fileName: string, username?: string) =>
      ipcRenderer.invoke('fs:read', mode, projectName, fileName, username),
    write: (mode: string, projectName: string, fileName: string, content: string, username?: string) =>
      ipcRenderer.invoke('fs:write', mode, projectName, fileName, content, username),
    delete: (mode: string, projectName: string, fileName: string, username?: string) =>
      ipcRenderer.invoke('fs:delete', mode, projectName, fileName, username),
  },

  // კოდის გაშვების API
  run: {
    frontend: (projectName: string, username?: string) =>
      ipcRenderer.invoke('run:frontend', projectName, username),
    stop: () => ipcRenderer.invoke('run:stop'),
    python: (projectName: string, fileName: string, username?: string) =>
      ipcRenderer.invoke('run:python', projectName, fileName, username),
    pythonStop: () => ipcRenderer.invoke('run:pythonStop'),
    onStdout: (cb: (data: string) => void) => {
      ipcRenderer.on('python:stdout', (_e, data) => cb(data));
    },
    onStderr: (cb: (data: string) => void) => {
      ipcRenderer.on('python:stderr', (_e, data) => cb(data));
    },
    onExit: (cb: (code: number) => void) => {
      ipcRenderer.on('python:exit', (_e, code) => cb(code));
    },
    removeAllListeners: () => {
      ipcRenderer.removeAllListeners('python:stdout');
      ipcRenderer.removeAllListeners('python:stderr');
      ipcRenderer.removeAllListeners('python:exit');
    },
  },
});
