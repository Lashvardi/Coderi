// კოდერი — ავტო-განახლების მოდული
// GitHub Releases-დან ამოწმებს ახალ ვერსიას და აყენებს

import { autoUpdater } from 'electron-updater';
import { BrowserWindow, ipcMain } from 'electron';

export function setupAutoUpdater(mainWindow: BrowserWindow): void {
  // ლოგები კონსოლში
  autoUpdater.logger = console;

  // macOS: არ ვაქვს Apple Developer — signing გამორთული
  autoUpdater.forceDevUpdateConfig = false;

  // ავტომატურად არ დააინსტალიროს — მომხმარებელს ვკითხავთ
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  // ივენთების გადაცემა renderer-ისთვის
  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update:checking');
  });

  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update:available', info.version);
  });

  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update:not-available');
  });

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('update:progress', Math.round(progress.percent));
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update:downloaded');
  });

  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update:error', err.message);
  });

  // IPC: renderer-იდან მოთხოვნები
  ipcMain.handle('update:check', () => {
    autoUpdater.checkForUpdates();
  });

  ipcMain.handle('update:download', () => {
    autoUpdater.downloadUpdate();
  });

  ipcMain.handle('update:install', () => {
    autoUpdater.quitAndInstall();
  });

  // აპის გაშვებისას ვამოწმებთ განახლებას (5 წამის შემდეგ)
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {});
  }, 5000);
}
