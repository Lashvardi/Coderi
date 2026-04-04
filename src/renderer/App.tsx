// კოდერი — მთავარი React კომპონენტი
// მართავს ნავიგაციას და ავტორიზაციის კონტექსტს

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import EditorPage from './pages/EditorPage';
import MaterialsPage from './pages/MaterialsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:mode" element={<ProjectsPage />} />
          <Route path="/editor/:mode/:project" element={<EditorPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
