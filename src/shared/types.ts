// კოდერი — საერთო ტიპები (Shared Types)
// ეს ფაილი შეიცავს ტიპებს, რომლებსაც Main და Renderer პროცესები იზიარებენ

// მომხმარებლის ინტერფეისი
export interface User {
  name: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

// პროექტის ფაილის ინტერფეისი
export interface ProjectFile {
  name: string;
  path: string;
  content: string;
}

// პროექტის ინტერფეისი
export interface Project {
  name: string;
  type: 'frontend' | 'python';
  files: ProjectFile[];
  createdAt: string;
  lastOpened: string;
}

// რედაქტორის რეჟიმი
export type EditorMode = 'frontend' | 'python';

// გაკვეთილის ინტერფეისი
export interface Lesson {
  id: string;
  title: string;
  category: 'frontend' | 'python';
  content: string;
}
