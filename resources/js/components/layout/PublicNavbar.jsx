import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { LogIn, Menu, X, ShieldCheck } from 'lucide-react';
import logoHarmonitas from '../../assets/LOGO HARMONITAS.png';

export const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang Sistem', href: '#tentang' },
    { name: 'Alur Kerja', href: '#alur' },
    { name: 'Wilayah Pokja', href: '#wilayah' },
    { name: 'Kontak Kami', href: '#kontak' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b1329]/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & System Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center p-1 border border-slate-700 shadow-md overflow-hidden shrink-0 transition-transform group-hover:scale-105">
              <img src={logoHarmonitas} alt="Logo Harmonitas" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-wider text-white">HARMONITAS</h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-md">RIAU</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold tracking-wide">HARMONISASI DAN FASILITASI RANPERDA & RANPERKADA TUNTAS</p>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-slate-300 hover:text-amber-400 transition-colors py-1 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA Login Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk / Login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {item.name}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Dashboard Sistem</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
