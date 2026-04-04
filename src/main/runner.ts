// კოდერი — კოდის გაშვება
// Frontend: localhost სერვერი + URL
// Python: child_process ეშვება და აბრუნებს output-ს

import { ipcMain, app, shell } from 'electron';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { startServer, stopServer } from './server';

let pythonProcess: ChildProcess | null = null;

// პროექტის დირექტორიის მისამართი
function getProjectDir(mode: string, projectName: string, username?: string): string {
  const base = username
    ? path.join(app.getPath('userData'), 'projects', username)
    : path.join(app.getPath('userData'), 'koderi-projects');
  return path.join(base, mode, projectName);
}

export function registerRunHandlers(): void {

  // Frontend: სერვერის გაშვება + ბრაუზერში გახსნა
  ipcMain.handle('run:frontend', async (_e, projectName: string, username?: string) => {
    try {
      const projectDir = getProjectDir('frontend', projectName, username);
      const port = await startServer(projectDir);
      const url = `http://127.0.0.1:${port}`;
      await shell.openExternal(url);
      return { success: true, url };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Frontend: სერვერის გათიშვა
  ipcMain.handle('run:stop', async () => {
    stopServer();
    return { success: true };
  });

  // Python: სკრიპტის გაშვება
  ipcMain.handle('run:python', async (event, projectName: string, fileName: string, username?: string) => {
    // წინა პროცესის გაჩერება
    if (pythonProcess) {
      pythonProcess.kill();
      pythonProcess = null;
    }

    const projectDir = getProjectDir('python', projectName, username);
    const filePath = path.join(projectDir, fileName);

    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      // ვცდით python3 ჯერ, მერე python
      const cmd = process.platform === 'win32' ? 'python' : 'python3';

      pythonProcess = spawn(cmd, [filePath], {
        cwd: projectDir,
        env: { ...process.env },
      });

      const webContents = event.sender;

      pythonProcess.stdout?.on('data', (data: Buffer) => {
        if (!webContents.isDestroyed()) {
          webContents.send('python:stdout', data.toString());
        }
      });

      pythonProcess.stderr?.on('data', (data: Buffer) => {
        if (!webContents.isDestroyed()) {
          webContents.send('python:stderr', data.toString());
        }
      });

      pythonProcess.on('close', (code) => {
        if (!webContents.isDestroyed()) {
          webContents.send('python:exit', code);
        }
        pythonProcess = null;
      });

      pythonProcess.on('error', (err) => {
        if (!webContents.isDestroyed()) {
          webContents.send('python:stderr', `შეცდომა: ${err.message}\nPython ვერ მოიძებნა. დარწმუნდი რომ Python დაინსტალირებულია.`);
          webContents.send('python:exit', 1);
        }
        pythonProcess = null;
      });

      resolve({ success: true });
    });
  });

  // Python: პროცესის გაჩერება
  ipcMain.handle('run:pythonStop', async () => {
    if (pythonProcess) {
      pythonProcess.kill();
      pythonProcess = null;
    }
    return { success: true };
  });
}
