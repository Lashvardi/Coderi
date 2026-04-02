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

// სასარგებლო ბმულის ინტერფეისი
export interface HelpfulLink {
  title: string;
  url: string;
}

// მასალის ინტერფეისი (ერთი თემა / ქვეთავი)
export interface Material {
  id: string;
  title: string;
  content: string;
  links?: HelpfulLink[];
}

// ლექციის ინტერფეისი (შეიცავს მრავალ მასალას)
export interface Lecture {
  id: string;
  title: string;
  materials: Material[];
}

// კურსის ინტერფეისი (შეიცავს მრავალ ლექციას)
export interface Course {
  id: string;
  title: string;
  icon: 'frontend' | 'python';
  lectures: Lecture[];
}

// ძველი Lesson ტიპი — backwards compat
export interface Lesson {
  id: string;
  title: string;
  category: 'frontend' | 'python';
  content: string;
  links?: HelpfulLink[];
}
