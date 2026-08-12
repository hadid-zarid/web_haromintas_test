import React from 'react';
import { Shield } from 'lucide-react';

export const RoleBadge = ({ role, className = '' }) => {
  const getBadgeStyle = (r) => {
    switch (r) {
      case 'Pokja 1':
      case 'Pokja 2':
      case 'Pokja 3':
        return 'flat-badge-blue';
      case 'Kakanwil':
        return 'flat-badge-amber';
      case 'Kadiv':
        return 'flat-badge-purple';
      case 'Biro Hukum':
        return 'flat-badge-emerald';
      default:
        return 'flat-badge-slate';
    }
  };

  return (
    <span className={`flat-badge text-xs font-bold ${getBadgeStyle(role)} ${className}`}>
      <Shield className="w-3 h-3" />
      {role || 'Umum'}
    </span>
  );
};

export default RoleBadge;
