// კოდერი — მთავარი პროცესი (Electron Main Process)
// ეს ფაილი ქმნის აპლიკაციის ფანჯარას და მართავს Electron-ის ძირითად ლოგიკას

import { app, BrowserWindow } from 'electron';
import path from 'path';

// განვითარების რეჟიმის შემოწმება
const isDev = !app.isPackaged;

function createWindow(): void {
  // მთავარი ფანჯრის შექმნა
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'კოდერი',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // კონტენტის ჩატვირთვა — dev სერვერიდან ან build-იდან
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // ფანჯრის სათაურის დაყენება
  mainWindow.on('ready-to-show', () => {
    mainWindow.setTitle('კოდერი');
  });
}

// აპლიკაციის მზადყოფნის შემდეგ ფანჯრის შექმნა
app.whenReady().then(() => {
  createWindow();

  // macOS-ზე dock-ზე დაკლიკებისას ახალი ფანჯრის შექმნა
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// ყველა ფანჯრის დახურვისას აპლიკაციის გათიშვა (macOS-ის გარდა)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
