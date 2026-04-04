// კოდერი — ფაილური სისტემის ოპერაციები
// პროექტ-ბაზირებული სტრუქტურა:
//   სტუმარი: userData/koderi-projects/{mode}/{projectName}/
//   ავტორიზებული: userData/projects/{username}/{mode}/{projectName}/

import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

// ბაზის დირექტორიების მისამართები
function getGlobalProjectsDir(): string {
  return path.join(app.getPath('userData'), 'koderi-projects');
}

function getUserProjectsDir(username: string): string {
  return path.join(app.getPath('userData'), 'projects', username);
}

// მომხმარებლის საქაღალდის შექმნა (რეგისტრაციისას)
export function createUserDir(username: string): void {
  const userDir = getUserProjectsDir(username);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
}

// პროექტების root დირექტორია მომხმარებლის/სტუმრის მიხედვით
function getBaseDir(username?: string): string {
  return username ? getUserProjectsDir(username) : getGlobalProjectsDir();
}

// უსაფრთხოების შემოწმება — path არ გადის ბაზის დირექტორიიდან
function safePath(base: string, ...parts: string[]): string {
  const resolved = path.resolve(base, ...parts);
  if (!resolved.startsWith(path.resolve(base))) {
    throw new Error('არაავტორიზებული ფაილის წვდომა');
  }
  return resolved;
}

// ===== პროექტ-დონის ოპერაციები =====

// პროექტების სიის წაკითხვა (mode = frontend | python)
function listProjects(mode: string, username?: string): { name: string; createdAt: number }[] {
  const base = getBaseDir(username);
  const modeDir = safePath(base, mode);
  if (!fs.existsSync(modeDir)) return [];

  const entries = fs.readdirSync(modeDir, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory())
    .map(e => {
      const stat = fs.statSync(path.join(modeDir, e.name));
      return { name: e.name, createdAt: stat.birthtimeMs };
    })
    .sort((a, b) => b.createdAt - a.createdAt); // უახლესი პირველი
}

// ახალი პროექტის შექმნა
function createProject(mode: string, projectName: string, username?: string): void {
  const base = getBaseDir(username);
  const projectDir = safePath(base, mode, projectName);
  if (fs.existsSync(projectDir)) {
    throw new Error('პროექტი ამ სახელით უკვე არსებობს');
  }
  fs.mkdirSync(projectDir, { recursive: true });
}

// პროექტის წაშლა
function deleteProject(mode: string, projectName: string, username?: string): void {
  const base = getBaseDir(username);
  const projectDir = safePath(base, mode, projectName);
  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
}

// ===== ფაილ-დონის ოპერაციები (პროექტის შიგნით) =====

// ფაილების სია პროექტში
function listFiles(mode: string, projectName: string, username?: string): { name: string; isDir: boolean }[] {
  const base = getBaseDir(username);
  const projectDir = safePath(base, mode, projectName);
  if (!fs.existsSync(projectDir)) return [];
  const entries = fs.readdirSync(projectDir, { withFileTypes: true });
  return entries.map(e => ({ name: e.name, isDir: e.isDirectory() }));
}

// ფაილის შიგთავსის წაკითხვა
function readFile(mode: string, projectName: string, fileName: string, username?: string): string {
  const base = getBaseDir(username);
  const filePath = safePath(base, mode, projectName, fileName);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
}

// ფაილის ჩაწერა
function writeFile(mode: string, projectName: string, fileName: string, content: string, username?: string): void {
  const base = getBaseDir(username);
  const filePath = safePath(base, mode, projectName, fileName);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf-8');
}

// ფაილის წაშლა
function deleteFile(mode: string, projectName: string, fileName: string, username?: string): void {
  const base = getBaseDir(username);
  const filePath = safePath(base, mode, projectName, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// ===== IPC ჰენდლერების რეგისტრაცია =====

export function registerFsHandlers(): void {
  // პროექტების სია
  ipcMain.handle('project:list', (_e, mode: string, username?: string) => {
    try {
      return { success: true, projects: listProjects(mode, username) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // პროექტის შექმნა
  ipcMain.handle('project:create', (_e, mode: string, projectName: string, username?: string) => {
    try {
      createProject(mode, projectName, username);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // პროექტის წაშლა
  ipcMain.handle('project:delete', (_e, mode: string, projectName: string, username?: string) => {
    try {
      deleteProject(mode, projectName, username);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // ფაილების სია პროექტში
  ipcMain.handle('fs:list', (_e, mode: string, projectName: string, username?: string) => {
    try {
      return { success: true, files: listFiles(mode, projectName, username) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // ფაილის წაკითხვა
  ipcMain.handle('fs:read', (_e, mode: string, projectName: string, fileName: string, username?: string) => {
    try {
      return { success: true, content: readFile(mode, projectName, fileName, username) };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // ფაილის ჩაწერა
  ipcMain.handle('fs:write', (_e, mode: string, projectName: string, fileName: string, content: string, username?: string) => {
    try {
      writeFile(mode, projectName, fileName, content, username);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // ფაილის წაშლა
  ipcMain.handle('fs:delete', (_e, mode: string, projectName: string, fileName: string, username?: string) => {
    try {
      deleteFile(mode, projectName, fileName, username);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}
