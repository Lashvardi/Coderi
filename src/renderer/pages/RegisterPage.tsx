// კოდერი — რეგისტრაციის გვერდი
// სრული ავტორიზაციის ლოგიკა Phase 3-ში
// ამჟამად აჩვენებს ფორმის UI-ს

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';

const RegisterPage: React.FC = () => {
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
          <UserPlus size={24} />
          <h2>რეგისტრაცია</h2>
        </div>

        {/* ფორმა */}
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">სახელი</label>
            <input
              type="text"
              className="form-input"
              placeholder="თქვენი სახელი..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">მომხმარებლის სახელი</label>
            <input
              type="text"
              className="form-input"
              placeholder="აირჩიეთ სახელი..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">პაროლი</label>
            <input
              type="password"
              className="form-input"
              placeholder="მინიმუმ 4 სიმბოლო..."
            />
          </div>

          <button type="submit" className="form-submit">
            <UserPlus size={15} />
            <span>რეგისტრაცია</span>
          </button>
        </form>

        {/* შესვლაზე გადასვლა */}
        <p className="auth-switch">
          უკვე გაქვთ ანგარიში?{' '}
          <button className="auth-link" onClick={() => navigate('/login')}>
            შესვლა
          </button>
        </p>
      </div>

      <div className="home-footer">
        <span>კოდერი v1.0.0</span>
      </div>
    </div>
  );
};

export default RegisterPage;
