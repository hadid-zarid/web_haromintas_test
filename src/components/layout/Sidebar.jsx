import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleBadge from '../common/RoleBadge';

import { 
  Scale, 
  Home, 
  FileText, 
  BookOpen, 
  LogOut, 
  X,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen, onTriggerLogout }) => {
  const { user, role } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/home', icon: Home },
    { label: 'Permohonan Peraturan', path: '/peraturan', icon: FileText },
    { label: 'Buku Panduan', path: '/panduan', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-[#1A1A5E]/60 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Navy Blue (#1A1A5E) Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#1A1A5E] border-r border-[#2E3A87] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Header Branding */}
          <div className="p-6 text-center border-b border-[#2E3A87] relative">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-slate-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo Badge in Navy Blue background with Golden Yellow (#FFC800) Accent */}
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#1A1A5E] text-[#FFC800] flex items-center justify-center font-black mb-3 border border-[#FFC800]/40 shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E3A87] border border-white/10 text-white text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-[#FFC800]" />
              <span>Kanwil Kemenkumham Riau</span>
            </div>

            <h2 className="text-xl font-black tracking-wider text-white">
              HARMONITAS
            </h2>
            <p className="text-[10px] text-[#FFC800] leading-tight mt-0.5 px-1 font-bold tracking-wide">
              Harmonisasi Ranperda & Ranperkada Tuntas
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5 mt-2">
            <p className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Navigasi Utama</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#2E3A87] text-white font-black border-l-4 border-[#FFC800]'
                        : 'text-slate-200 hover:bg-[#2E3A87]/60 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FFC800]' : 'text-slate-300'}`} />
                        <span className="tracking-wide">{item.label}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FFC800]" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card & Logout */}
        <div className="p-4 border-t border-[#2E3A87] bg-[#14144B]">
          <div className="p-3 rounded-xl bg-[#2E3A87]/60 border border-white/10 mb-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-[#FFC800] object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Operator Kanwil'}</p>
                <p className="text-[10px] text-slate-300 truncate">NIP: {user?.nip || '-'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <RoleBadge role={role} />
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online
              </span>
            </div>
          </div>

          <button
            onClick={onTriggerLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold flat-btn-danger"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
