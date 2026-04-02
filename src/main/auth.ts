// კოდერი — ავტორიზაციის მოდული (Main Process)
// მომხმარებლების რეგისტრაცია და შესვლა JSON ფაილის საშუალებით
// პაროლების ჰეშირება crypto.scrypt-ით (Node.js built-in, არ საჭიროებს bcrypt-ს)

import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createUserDir } from './fileSystem';

// მომხმარებლის ინტერფეისი (შიდა, პაროლის ჰეშით)
interface StoredUser {
  name: string;
  username: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

// users.json ფაილის მისამართი
function getUsersFilePath(): string {
  return path.join(app.getPath('userData'), 'users.json');
}

// მომხმარებლების წაკითხვა ფაილიდან
function readUsers(): StoredUser[] {
  const filePath = getUsersFilePath();
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// მომხმარებლების ჩაწერა ფაილში
function writeUsers(users: StoredUser[]): void {
  const filePath = getUsersFilePath();
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
}

// პაროლის ჰეშირება crypto.scrypt-ით
function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

// IPC ჰენდლერების რეგისტრაცია
export function registerAuthHandlers(): void {

  // რეგისტრაცია
  ipcMain.handle('auth:register', async (_event, data: { name: string; username: string; password: string }) => {
    const { name, username, password } = data;

    // ვალიდაცია
    if (!name || name.trim().length === 0) {
      return { success: false, error: 'სახელი აუცილებელია' };
    }
    if (!username || username.trim().length === 0) {
      return { success: false, error: 'მომხმარებლის სახელი აუცილებელია' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'პაროლი მინიმუმ 4 სიმბოლო უნდა იყოს' };
    }

    const users = readUsers();

    // შემოწმება — ხომ არ არსებობს უკვე
    if (users.find(u => u.username === username.trim())) {
      return { success: false, error: 'ეს მომხმარებლის სახელი უკვე დაკავებულია' };
    }

    // პაროლის ჰეშირება
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = await hashPassword(password, salt);

    // მომხმარებლის შენახვა
    const newUser: StoredUser = {
      name: name.trim(),
      username: username.trim(),
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeUsers(users);

    // მომხმარებლის პროექტების საქაღალდის შექმნა
    createUserDir(username.trim());

    return {
      success: true,
      user: { name: newUser.name, username: newUser.username },
    };
  });

  // შესვლა
  ipcMain.handle('auth:login', async (_event, data: { username: string; password: string }) => {
    const { username, password } = data;

    if (!username || !password) {
      return { success: false, error: 'შეავსეთ ყველა ველი' };
    }

    const users = readUsers();
    const user = users.find(u => u.username === username.trim());

    if (!user) {
      return { success: false, error: 'მომხმარებელი ვერ მოიძებნა' };
    }

    // პაროლის შემოწმება
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      return { success: false, error: 'პაროლი არასწორია' };
    }

    return {
      success: true,
      user: { name: user.name, username: user.username },
    };
  });

  // DEBUG: ყველა მომხმარებლის წაშლა
  ipcMain.handle('auth:clearAll', async () => {
    writeUsers([]);
    return { success: true };
  });
}
