// კოდერი — Preload სკრიპტი
// ეს ფაილი არის ხიდი Main პროცესსა და Renderer პროცესს შორის
// contextBridge-ის საშუალებით უსაფრთხოდ გადავცემთ API-ს renderer-ს

import { contextBridge } from 'electron';

// API-ს გამოტანა renderer პროცესისთვის
contextBridge.exposeInMainWorld('koderiAPI', {
  // ფაილური სისტემის ოპერაციები (შემდეგ ფაზებში დაემატება)
  platform: process.platform,
});
