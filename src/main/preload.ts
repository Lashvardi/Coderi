// კოდერი — Preload სკრიპტი
// ხიდი Main პროცესსა და Renderer პროცესს შორის
// contextBridge-ით უსაფრთხოდ გადავცემთ API-ს renderer-ს

import { contextBridge, ipcRenderer } from 'electron';

// API-ს გამოტანა renderer პროცესისთვის
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
});
