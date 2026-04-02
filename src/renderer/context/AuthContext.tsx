// კოდერი — ავტორიზაციის კონტექსტი
// მართავს მომხმარებლის სესიას აპლიკაციის მასშტაბით

import React, { createContext, useContext, useState, useCallback } from 'react';

// მომხმარებლის ტიპი (პაროლის გარეშე, მხოლოდ სესიისთვის)
interface SessionUser {
  name: string;
  username: string;
}

interface AuthContextType {
  user: SessionUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider — ახვევს აპლიკაციას და უზიარებს სესიას ყველა კომპონენტს
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    const result = await window.koderiAPI.auth.login({ username, password });
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const register = useCallback(async (name: string, username: string, password: string) => {
    const result = await window.koderiAPI.auth.register({ name, username, password });
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook — ნებისმიერი კომპონენტიდან სესიის წვდომისთვის
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
