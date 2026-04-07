// კოდერი — შესვლის გვერდი
// მომხმარებლის ავტორიზაცია username + password-ით

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_LABEL } from '../constants';
import TitleBar from '../components/TitleBar';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'შესვლა ვერ მოხერხდა');
    }
  };

  return (
    <div className="auth-layout">
      <TitleBar />
      <div className="auth-card">
        <button className="auth-back" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>უკან</span>
        </button>

        <div className="auth-header">
          <LogIn size={24} />
          <h2>შესვლა</h2>
        </div>

        {/* შეცდომის შეტყობინება */}
        {error && (
          <div className="form-error">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">მომხმარებლის სახელი</label>
            <input
              type="text"
              className="form-input"
              placeholder="ჩაწერეთ სახელი..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">პაროლი</label>
            <input
              type="password"
              className="form-input"
              placeholder="ჩაწერეთ პაროლი..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            <LogIn size={15} />
            <span>{loading ? 'მიმდინარეობს...' : 'შესვლა'}</span>
          </button>
        </form>

        <p className="auth-switch">
          არ გაქვთ ანგარიში?{' '}
          <button className="auth-link" onClick={() => navigate('/register')}>
            რეგისტრაცია
          </button>
        </p>
      </div>

      <div className="home-footer">
        <span>{APP_LABEL}</span>
      </div>
    </div>
  );
};

export default LoginPage;
