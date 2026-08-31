import React, { createContext, useContext } from 'react';
import { usePage, router } from '@inertiajs/react';
import { MOCK_USERS } from '../mock/mockUsers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  let authUser = null;
  
  try {
    const page = usePage();
    authUser = page.props?.auth?.user;
  } catch (e) {
    // Fallback if accessed outside Inertia component tree
    authUser = null;
  }

  let unit = 'Kantor Wilayah Kementerian Hukum Riau';
  if ((authUser?.role === 'TIM_KERJA' || authUser?.role === 'POKJA') && authUser.tim_kerja) {
    unit = `Kanwil Riau - ${authUser.tim_kerja.nama_tim_kerja}`;
  } else if (authUser?.role === 'BIRO_HUKUM') {
    unit = 'Biro Hukum Provinsi Riau';
  } else if (authUser?.role === 'ADMIN') {
    unit = 'Administrator Sistem Kanwil Riau';
  } else if (authUser?.role === 'PIMPINAN') {
    unit = 'Pimpinan Kanwil Kemenkum Provinsi Riau';
  }

  const user = authUser ? {
    ...authUser,
    id: authUser.user_id || authUser.id,
    name: authUser.nama || authUser.name,
    unit,
    avatar: authUser.avatar_path || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
  } : null;

  const role = user?.role || null;

  const login = (credentials) => {
    if (typeof credentials === 'object' && credentials.email) {
      router.post('/login', credentials);
    }
  };

  const logout = () => {
    router.post('/logout');
  };

  return {
    user,
    role,
    isAdmin: role === 'ADMIN',
    isTimKerja: role === 'TIM_KERJA' || role === 'POKJA',
    isPokja: role === 'TIM_KERJA' || role === 'POKJA',
    isBiroHukum: role === 'BIRO_HUKUM',
    isPimpinan: role === 'PIMPINAN',
    login,
    logout,
    availableUsers: MOCK_USERS,
  };
};

export default AuthContext;
