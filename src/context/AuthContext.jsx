import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('judgex_token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('judgex_uid') || null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('judgex_is_admin') === 'true');
  const [username, setUsername] = useState(localStorage.getItem('judgex_username') || null);
  
  // Local submission history cache for rich feedback
  const [submissionsHistory, setSubmissionsHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('judgex_submissions') || '[]');
    } catch {
      return [];
    }
  });

  // Save submission history to localStorage
  useEffect(() => {
    localStorage.setItem('judgex_submissions', JSON.stringify(submissionsHistory));
  }, [submissionsHistory]);

  const loginUser = (authData, userUsername) => {
    const { token, uId, isAdmin } = authData;
    setToken(token);
    setUserId(uId);
    setIsAdmin(!!isAdmin);
    setUsername(userUsername);

    localStorage.setItem('judgex_token', token);
    localStorage.setItem('judgex_uid', uId);
    localStorage.setItem('judgex_is_admin', isAdmin ? 'true' : 'false');
    localStorage.setItem('judgex_username', userUsername);
  };

  const logoutUser = () => {
    setToken(null);
    setUserId(null);
    setIsAdmin(false);
    setUsername(null);

    localStorage.removeItem('judgex_token');
    localStorage.removeItem('judgex_uid');
    localStorage.removeItem('judgex_is_admin');
    localStorage.removeItem('judgex_username');
  };

  const recordSubmission = (submission) => {
    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user_id: userId,
      username: username || 'User',
      ...submission
    };
    setSubmissionsHistory((prev) => [newSubmission, ...prev]);
  };

  return (
    <AuthContext.Provider value={{
      token,
      userId,
      isAdmin,
      username,
      isAuthenticated: !!token,
      loginUser,
      logoutUser,
      submissionsHistory,
      recordSubmission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
