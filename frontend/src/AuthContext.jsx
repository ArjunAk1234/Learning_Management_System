import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [studentId, setStudentId] = useState(localStorage.getItem('studentId'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
    if (studentId) {
      localStorage.setItem('studentId', studentId);
    } else {
      localStorage.removeItem('studentId');
    }
  }, [token, userRole, studentId]);

  const login = (newToken, role, sId) => {
    setToken(newToken);
    setUserRole(role);
    setStudentId(sId);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setStudentId(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, userRole, studentId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
