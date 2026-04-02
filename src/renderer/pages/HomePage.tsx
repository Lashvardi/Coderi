// კოდერი — მთავარი გვერდი (Home Page)
// სამი მთავარი ღილაკი ნავიგაციით და ავტორიზაციის სექცია

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Terminal, BookOpen, LogIn, UserPlus, Code2 } from 'lucide-react';
import '../styles/global.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* ლოგო და სათაური */}
      <div className="home-header">
        <div className="home-logo">
          <Code2 size={32} strokeWidth={2} />
        </div>
        <h1 className="home-title">კოდერი</h1>
        <p className="home-subtitle">პროგრამირება გამარტივებული!</p>
      </div>

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
            <span className="btn-desc">HTML, CSS, JavaScript</span>
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
            <span className="btn-desc">სკრიპტები და პროგრამები</span>
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
            <span className="btn-desc">გაკვეთილები და სილაბუსი</span>
          </div>
        </button>
      </div>

      {/* ავტორიზაციის ღილაკები */}
      <div className="home-auth">
        <button className="auth-btn auth-btn-login" onClick={() => navigate('/login')}>
          <LogIn size={15} />
          <span>შესვლა</span>
        </button>
        <button className="auth-btn auth-btn-register" onClick={() => navigate('/register')}>
          <UserPlus size={15} />
          <span>რეგისტრაცია</span>
        </button>
      </div>

      {/* სტატუს ბარი */}
      <div className="home-footer">
        <span>კოდერი v1.0.0</span>
      </div>
    </div>
  );
};

export default HomePage;
