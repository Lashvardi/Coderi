// კოდერი — მომხმარებლის ბეჯი (Toolbar-ში გამოსაყენებელი)
// აჩვენებს მომხმარებლის სახელს ან შესვლის ღილაკს

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserBadge: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <button className="toolbar-btn" onClick={() => navigate('/login')} title="შესვლა">
        <LogIn size={16} />
      </button>
    );
  }

  return (
    <div className="toolbar-mode" title={user.username}>
      <User size={14} />
      <span>{user.name}</span>
    </div>
  );
};

export default UserBadge;
