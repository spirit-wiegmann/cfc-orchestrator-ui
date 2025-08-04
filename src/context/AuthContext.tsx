import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: () => void;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('github_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/callback`;

  useEffect(() => {
    if (token) {
      localStorage.setItem('github_token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('github_token');
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = () => {
    const scope = 'repo workflow read:org';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const logout = () => {
    setTokenState(null);
  };

  const setToken = (newToken: string) => {
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
