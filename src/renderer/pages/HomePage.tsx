// კოდერი — მთავარი გვერდი (Home Page)
// სამი მთავარი ღილაკი, ავტორიზაცია და მისალმება

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Terminal, BookOpen, LogIn, UserPlus, LogOut, User, Trash2 } from 'lucide-react';
import logoSvg from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import { APP_LABEL } from '../constants';
import '../styles/global.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [debugMsg, setDebugMsg] = useState('');

  const handleClearUsers = async () => {
    await window.koderiAPI.auth.clearAll();
    logout();
    setDebugMsg('ყველა მომხმარებელი წაიშალა');
    setTimeout(() => setDebugMsg(''), 3000);
  };

  return (
    <div className="home-container">
      {/* ლოგო და სათაური */}
      <div className="home-header">
        <div className="home-logo">
          <img src={logoSvg} alt="კოდერი" className="home-logo-img" />
        </div>
        <h1 className="home-title">კოდერი</h1>
        <p className="home-subtitle">ქართული IDE</p>
      </div>

      {/* მისალმება — თუ მომხმარებელი შესულია */}
      {user && (
        <div className="home-greeting">
          <User size={16} />
          <span>გამარჯობა, {user.name}!</span>
        </div>
      )}

      {/* მთავარი ღილაკები */}
      <div className="home-buttons">
        <button
          className="home-btn home-btn-frontend"
          onClick={() => navigate('/editor/frontend')}
        >
          <div className="btn-icon">
            <Globe size={18} />
          </div>
          <div className="btn-text">
            <span className="btn-label">ფრონტ-ენდი</span>
            <span className="btn-desc">WEB პროგრამირება</span>
          </div>
        </button>

        <button
          className="home-btn home-btn-python"
          onClick={() => navigate('/editor/python')}
        >
          <div className="btn-icon">
            <Terminal size={18} />
          </div>
          <div className="btn-text">
            <span className="btn-label">Python</span>
            <span className="btn-desc">Python პროგრამირება</span>
          </div>
        </button>

        <button
          className="home-btn home-btn-materials"
          onClick={() => navigate('/materials')}
        >
          <div className="btn-icon">
            <BookOpen size={18} />
          </div>
          <div className="btn-text">
            <span className="btn-label">მასალები</span>
            <span className="btn-desc">საჭირო მასალები</span>
          </div>
        </button>
      </div>

      {/* ავტორიზაციის ღილაკები */}
      <div className="home-auth">
        {user ? (
          <button className="auth-btn auth-btn-logout" onClick={logout}>
            <LogOut size={15} />
            <span>გამოსვლა</span>
          </button>
        ) : (
          <>
            <button className="auth-btn auth-btn-login" onClick={() => navigate('/login')}>
              <LogIn size={15} />
              <span>შესვლა</span>
            </button>
            <button className="auth-btn auth-btn-register" onClick={() => navigate('/register')}>
              <UserPlus size={15} />
              <span>რეგისტრაცია</span>
            </button>
          </>
        )}
      </div>

      {/* DEBUG: მომხმარებლების წაშლა */}
      <div className="debug-section">
        <button className="debug-btn" onClick={handleClearUsers}>
          <Trash2 size={13} />
          <span>Clear All Users</span>
        </button>
        {debugMsg && <span className="debug-msg">{debugMsg}</span>}
      </div>

      {/* სტატუს ბარი */}
      <div className="home-footer">
        <span>{APP_LABEL}</span>
      </div>
    </div>
  );
};

export default HomePage;
