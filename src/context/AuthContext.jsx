import React, { createContext, useContext, useState } from 'react';
import { MOCK_USERS, ROLES } from '../mock/mockUsers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to Proja 1 if available or null (user can select role at login)
  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('app_user_role');
    if (savedRole) {
      return MOCK_USERS.find(u => u.role === savedRole) || MOCK_USERS[0];
    }
    return MOCK_USERS[0]; // Default logged-in user simulation
  });

  const login = (roleName) => {
    const matchedUser = MOCK_USERS.find(u => u.role === roleName) || {
      id: 'usr-custom',
      name: `User ${roleName}`,
      role: roleName,
      nip: '19900000 202000 1 001',
      unit: 'Instansi Pemerintah',
      email: `${roleName.toLowerCase().replace(/\s+/g, '')}@kemenkumham.go.id`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };
    setUser(matchedUser);
    localStorage.setItem('app_user_role', roleName);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('app_user_role');
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout, availableUsers: MOCK_USERS }}>
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
