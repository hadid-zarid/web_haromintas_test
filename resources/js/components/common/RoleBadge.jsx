import React from 'react';

export const RoleBadge = ({ role }) => {
  const getBadgeStyle = () => {
    if (!role) return 'bg-slate-100 text-slate-700 border-slate-200';

    if (role.startsWith('Tim Kerja') || role.startsWith('Proja') || role.startsWith('Pokja')) {
      return 'bg-blue-50 text-[#2B3056] border-blue-200 font-bold';
    }

    switch (role) {
      case 'Kakanwil':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      case 'Kadiv':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold';
      case 'Biro Hukum':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const displayName = role?.startsWith('Proja') ? role.replace('Proja', 'Tim Kerja') : role;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getBadgeStyle()}`}>
      {displayName}
    </span>
  );
};

export default RoleBadge;
