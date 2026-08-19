import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, role } = useAuth();

  useEffect(() => {
    if (!user || !role) {
      router.visit('/login');
    }
  }, [user, role]);

  if (!user || !role) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
