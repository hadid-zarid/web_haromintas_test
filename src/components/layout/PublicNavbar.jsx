import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, LogIn } from 'lucide-react';

export const PublicNavbar = () => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] text-white border-b border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Name */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold border border-blue-700/50">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black tracking-wider text-white">HARMONITAS</h1>
              <p className="text-[10px] text-blue-300 font-bold tracking-wide">HARMONISASI RANPERDA & RANPERKADA TUNTAS</p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold">
            <a href="#beranda" className="text-slate-300 hover:text-blue-300 transition-colors">Beranda</a>
            <a href="#tentang" className="text-slate-300 hover:text-blue-300 transition-colors">Tentang Sistem</a>
            <a href="#alur" className="text-slate-300 hover:text-blue-300 transition-colors">Alur Kerja</a>
            <a href="#kontak" className="text-slate-300 hover:text-blue-300 transition-colors">Kontak Kami</a>
          </nav>

          {/* CTA Login Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl flat-btn-navy text-white font-black text-xs transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk / Login</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
