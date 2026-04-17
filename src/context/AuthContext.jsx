import { createContext, useContext, useState } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setUser({ ...mockUser, name, email });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
