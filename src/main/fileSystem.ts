// კოდერი — ფაილური სისტემის ოპერაციები
// ეს ფაილი მართავს ფაილების წაკითხვას, ჩაწერას და წაშლას
// მომხმარებლის პროექტები ინახება userData/projects/{username}/ დირექტორიაში

import { app } from 'electron';
import fs from 'fs';
import path from 'path';

// პროექტების საქაღალდის მისამართი
export function getProjectsDir(): string {
  return path.join(app.getPath('userData'), 'projects');
}

// მომხმარებლის საქაღალდის შექმნა (რეგისტრაციისას)
export function createUserDir(username: string): void {
  const userDir = path.join(getProjectsDir(), username);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
}
