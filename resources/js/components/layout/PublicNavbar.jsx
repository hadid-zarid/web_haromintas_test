import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Globe2, LogIn, Mail, Menu, Phone, X, LayoutDashboard, ArrowRight } from 'lucide-react';
import logoHarmonitas from '../../assets/LOGO HARMONITAS.png';

export const PublicNavbar = () => {
  const { auth } = usePage().props || {};
  const user = auth?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang Sistem', href: '#tentang' },
    { name: 'Alur & Dokumen', href: '#alur' },
    { name: 'Fitur Penunjang', href: '#fitur' },
    { name: 'Wilayah Tim Kerja', href: '#wilayah' },
    { name: 'Kontak Kami', href: '#kontak' },
  ];

  return (
    <>
      {/* Top Notification Bar in Kemenkum Navy */}
      <div className="bg-[#2B3056] text-white border-b border-[#3A4070] hidden sm:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-xs font-semibold sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 text-white/90">
            <span className="inline-flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[#FFD82B]" />
              harmonitas.kanwil@kemenkum.go.id
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[#FFD82B]" />
              (0761) 853000
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-white/90">
            <Globe2 className="h-3.5 w-3.5 text-[#FFD82B]" />
            <span>ID</span>
            <span className="text-white/30">|</span>
            <span className="text-white/60">EN</span>
          </span>
        </div>
      </div>

      {/* Main Floating Island Header on Scroll */}
      <div
        className={`z-50 transition-all duration-300 font-sans ${
          isScrolled
            ? 'fixed top-2.5 sm:top-3 inset-x-3 sm:inset-x-6 max-w-6xl mx-auto'
            : 'sticky top-0 w-full'
        }`}
      >
        <header
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-900/5 px-4 sm:px-5'
              : 'border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`mx-auto flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'h-[56px] max-w-6xl' : 'h-[64px] max-w-7xl'
            }`}
          >
            {/* Logo and Brand */}
            <Link href="/" className="group flex min-w-0 items-center gap-2.5 shrink-0">
              <span
                className={`shrink-0 flex items-center justify-center transition-all ${
                  isScrolled ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-9 w-9 sm:h-10 sm:w-10'
                }`}
              >
                <img
                  src={logoHarmonitas}
                  alt="Logo HARMONITAS"
                  className="h-full w-full object-contain drop-shadow-xs"
                />
              </span>

              <span className="min-w-0">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`font-extrabold tracking-wide text-[#2B3056] transition-all whitespace-nowrap ${
                      isScrolled ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                    }`}
                  >
                    HARMONITAS
                  </span>
                  <span className="rounded-md border border-[#FFD82B]/80 bg-[#FFF9DF] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#2B3056]">
                    Riau
                  </span>
                </span>
                {!isScrolled && (
                  <span className="hidden xl:block truncate text-[10.5px] font-medium tracking-wide text-slate-500 max-w-[260px]">
                    Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
                  </span>
                )}
              </span>
            </Link>

            {/* Desktop Nav Links (Clean, Balanced Size, No Text-Wrap) */}
            <nav className="hidden items-center gap-3.5 xl:gap-5 lg:flex">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative py-1.5 text-xs xl:text-[13px] font-semibold text-slate-700 hover:text-[#2B3056] whitespace-nowrap transition-colors"
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-0 rounded-full bg-[#FFC800] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Login / Dashboard CTA Button */}
            <div className="hidden items-center gap-2.5 lg:flex shrink-0">
              {user ? (
                <Link
                  href="/home"
                  className="inline-flex h-9 px-4 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 font-bold text-xs text-[#2B3056] shadow-sm transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Ke Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-70" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-9 px-4 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 font-bold text-xs text-[#2B3056] shadow-sm transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Masuk Petugas</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center gap-2 lg:hidden shrink-0">
              {user ? (
                <Link
                  href="/home"
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#FFD82B] to-[#FFB943] px-3 text-xs font-bold text-[#2B3056] shadow-2xs whitespace-nowrap"
                >
                  <LayoutDashboard className="h-3 w-3" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#FFD82B] to-[#FFB943] px-3 text-xs font-bold text-[#2B3056] shadow-2xs whitespace-nowrap"
                >
                  <LogIn className="h-3 w-3" />
                  Masuk
                </Link>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[#2B3056]"
                aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="border-t border-slate-100 pb-3 pt-2 lg:hidden">
              <nav className="space-y-1">
                {navLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#2B3056]"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </header>
      </div>
    </>
  );
};

export default PublicNavbar;
