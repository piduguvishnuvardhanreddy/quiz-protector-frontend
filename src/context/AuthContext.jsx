import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as loginService, register as registerService, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { token, user: userData } = await loginService(email, password);
      localStorage.setItem('token', token);
      setUser(userData);
      
      // Redirect to dashboard based on role
      const redirectTo = userData.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectTo);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { token, user: newUser } = await registerService(userData);
      localStorage.setItem('token', token);
      setUser(newUser);
      // Redirect based on role after registration
      const redirectTo = newUser.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectTo);
      return { success: true };
    } catch (error) {
      setError(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const clearError = () => setError(null);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        clearError,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
