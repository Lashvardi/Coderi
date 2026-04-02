// კოდერი — შესვლის გვერდი
// სრული ავტორიზაციის ლოგიკა Phase 3-ში
// ამჟამად აჩვენებს ფორმის UI-ს

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-layout">
      <div className="auth-card">
        {/* უკან დაბრუნება */}
        <button className="auth-back" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>უკან</span>
        </button>

        {/* ფორმის სათაური */}
        <div className="auth-header">
          <LogIn size={24} />
          <h2>შესვლა</h2>
        </div>

        {/* ფორმა */}
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">მომხმარებლის სახელი</label>
            <input
              type="text"
              className="form-input"
              placeholder="ჩაწერეთ სახელი..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">პაროლი</label>
            <input
              type="password"
              className="form-input"
              placeholder="ჩაწერეთ პაროლი..."
            />
          </div>

          <button type="submit" className="form-submit">
            <LogIn size={15} />
            <span>შესვლა</span>
          </button>
        </form>

        {/* რეგისტრაციაზე გადასვლა */}
        <p className="auth-switch">
          არ გაქვთ ანგარიში?{' '}
          <button className="auth-link" onClick={() => navigate('/register')}>
            რეგისტრაცია
          </button>
        </p>
      </div>

      <div className="home-footer">
        <span>კოდერი v1.0.0</span>
      </div>
    </div>
  );
};

export default LoginPage;
