// კოდერი — რეგისტრაციის გვერდი
// ახალი მომხმარებლის შექმნა — სახელი, username, პაროლი

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_LABEL } from '../constants';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(name, username, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'რეგისტრაცია ვერ მოხერხდა');
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <button className="auth-back" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>უკან</span>
        </button>

        <div className="auth-header">
          <UserPlus size={24} />
          <h2>რეგისტრაცია</h2>
        </div>

        {error && (
          <div className="form-error">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">სახელი</label>
            <input
              type="text"
              className="form-input"
              placeholder="თქვენი სახელი..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">მომხმარებლის სახელი</label>
            <input
              type="text"
              className="form-input"
              placeholder="აირჩიეთ სახელი..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">პაროლი</label>
            <input
              type="password"
              className="form-input"
              placeholder="მინიმუმ 4 სიმბოლო..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            <UserPlus size={15} />
            <span>{loading ? 'მიმდინარეობს...' : 'რეგისტრაცია'}</span>
          </button>
        </form>

        <p className="auth-switch">
          უკვე გაქვთ ანგარიში?{' '}
          <button className="auth-link" onClick={() => navigate('/login')}>
            შესვლა
          </button>
        </p>
      </div>

      <div className="home-footer">
        <span>{APP_LABEL}</span>
      </div>
    </div>
  );
};

export default RegisterPage;
