import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';

export const RoleBadge = ({ role, timKerjaName, pokjaName, className = '' }) => {
  const normalized = (role || '').toUpperCase();
  const unitName = timKerjaName || pokjaName;

  const getBadgeStyle = (r) => {
    switch (r) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'TIM_KERJA':
      case 'POKJA':
      case 'PROJA_1':
      case 'PROJA_2':
      case 'PROJA_3':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BIRO_HUKUM':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PIMPINAN':
      case 'KAKANWIL':
      case 'KADIV':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLabel = () => {
    if (normalized === 'ADMIN') return 'Administrator';
    if (normalized === 'TIM_KERJA' || normalized === 'POKJA') {
      return unitName ? `Tim Kerja (${unitName})` : 'Tim Kerja Kanwil';
    }
    if (normalized === 'BIRO_HUKUM') return 'Biro Hukum Provinsi';
    if (normalized === 'PIMPINAN') return 'Pimpinan Kanwil';
    return role || 'Umum';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border ${getBadgeStyle(normalized)} ${className}`}>
      {normalized === 'ADMIN' ? (
        <ShieldCheck className="w-3 h-3 text-purple-600" />
      ) : (normalized === 'TIM_KERJA' || normalized === 'POKJA') ? (
        <Shield className="w-3 h-3 text-blue-600" />
      ) : normalized === 'BIRO_HUKUM' ? (
        <UserCheck className="w-3 h-3 text-emerald-600" />
      ) : (
        <ShieldAlert className="w-3 h-3 text-amber-600" />
      )}
      <span>{getLabel()}</span>
    </span>
  );
};

export default RoleBadge;
