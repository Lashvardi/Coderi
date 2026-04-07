// კოდერი — მთავარი პროცესი (Electron Main Process)
// ეს ფაილი ქმნის აპლიკაციის ფანჯარას და მართავს Electron-ის ძირითად ლოგიკას

import { app, BrowserWindow, ipcMain, Menu, nativeImage } from 'electron';
import path from 'path';
import { registerAuthHandlers } from './auth';
import { registerFsHandlers } from './fileSystem';
import { registerRunHandlers } from './runner';

// განვითარების რეჟიმის შემოწმება
const isDev = !app.isPackaged;

function createWindow(): void {
  // მთავარი ფანჯრის შექმნა
  const isMac = process.platform === 'darwin';

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'კოდერი',
    icon: path.join(__dirname, '../../resources/icon.png'),
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    frame: isMac ? true : false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // კონტენტის ჩატვირთვა — dev სერვერიდან ან build-იდან
  if (isDev) {
    mainWindow.loadURL('http://localhost:5200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Windows/Linux: ფანჯრის კონტროლის IPC ჰენდლერები
  if (!isMac) {
    ipcMain.on('window:minimize', () => mainWindow.minimize());
    ipcMain.on('window:maximize', () => {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    });
    ipcMain.on('window:close', () => mainWindow.close());
  }

  // ფანჯრის სათაურის დაყენება
  mainWindow.on('ready-to-show', () => {
    mainWindow.setTitle('კოდერი');
  });
}

// აპლიკაციის მენიუ — მინიმალური, სუფთა
function buildMenu(): void {
  const isMac = process.platform === 'darwin';
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac ? [{
      label: 'კოდერი',
      submenu: [
        { role: 'about' as const, label: 'კოდერის შესახებ' },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const, label: 'გამორთვა' },
      ],
    }] : []),
    {
      label: 'რედაქტირება',
      submenu: [
        { role: 'undo', label: 'გაუქმება' },
        { role: 'redo', label: 'თავიდან' },
        { type: 'separator' },
        { role: 'cut', label: 'ამოჭრა' },
        { role: 'copy', label: 'კოპირება' },
        { role: 'paste', label: 'ჩასმა' },
        { role: 'selectAll', label: 'ყველას მონიშვნა' },
      ],
    },
    {
      label: 'ფანჯარა',
      submenu: [
        { role: 'minimize', label: 'შემცირება' },
        { role: 'togglefullscreen', label: 'სრული ეკრანი' },
        ...(isMac ? [
          { type: 'separator' as const },
          { role: 'front' as const },
        ] : [
          { role: 'close' as const, label: 'დახურვა' },
        ]),
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// აპლიკაციის მზადყოფნის შემდეგ ფანჯრის შექმნა
app.whenReady().then(() => {
  // IPC ჰენდლერების რეგისტრაცია
  registerAuthHandlers();
  registerFsHandlers();
  registerRunHandlers();
  buildMenu();

  // აპლიკაციის აიქონის დაყენება (dev რეჟიმშიც)
  const iconPath = path.join(__dirname, '../../resources/icon.png');
  if (process.platform === 'darwin') {
    app.dock.setIcon(nativeImage.createFromPath(iconPath));
  }

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
