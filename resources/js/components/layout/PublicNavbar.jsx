import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Globe2, LogIn, Mail, Menu, Phone, X } from 'lucide-react';
import logoHarmonitas from '../../assets/LOGO HARMONITAS.png';

export const PublicNavbar = () => {
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
    { name: 'Wilayah Tim Kerja', href: '#wilayah' },
    { name: 'Alur Kerja', href: '#alur' },
    { name: 'Kontak Kami', href: '#kontak' },
  ];

  return (
    <>
      {/* Top Notification Bar in Kemenkumham Navy (Scrolls away naturally) */}
      <div className="bg-[#2B3056] text-white border-b border-[#3A4070] hidden sm:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-[11px] font-semibold sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#FFD82B]" />
              harmonitas.kanwil@kemenkum.go.id
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[#FFD82B]" />
              (0761) 853000
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-white/80">
            <Globe2 className="h-3.5 w-3.5 text-[#FFD82B]" />
            <span>ID</span>
            <span className="text-white/30">|</span>
            <span className="text-white/50">EN</span>
          </span>
        </div>
      </div>

      {/* Main Floating Island Header on Scroll */}
      <div
        className={`z-50 transition-all duration-300 font-sans ${
          isScrolled
            ? 'fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 max-w-6xl mx-auto'
            : 'sticky top-0 w-full'
        }`}
      >
        <header
          className={`w-full transition-all duration-300 ${
            isScrolled
              ? 'rounded-2xl border border-slate-200/90 bg-white/92 backdrop-blur-xl shadow-xl shadow-slate-900/5 px-4 sm:px-6'
              : 'border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`mx-auto flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'h-[56px] max-w-6xl' : 'h-[66px] max-w-7xl'
            }`}
          >
            {/* Logo and Brand */}
            <Link href="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span
                className={`shrink-0 flex items-center justify-center transition-all ${
                  isScrolled ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-9 w-9 sm:h-10 sm:w-10'
                }`}
              >
                <img
                  src={logoHarmonitas}
                  alt="Logo HARMONITAS"
                  className="h-full w-full object-contain drop-shadow-2xs"
                />
              </span>

              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span
                    className={`font-bold tracking-wide text-[#2B3056] transition-all ${
                      isScrolled ? 'text-[15px]' : 'text-base sm:text-[17px]'
                    }`}
                  >
                    HARMONITAS
                  </span>
                  <span className="hidden rounded-full border border-[#FFD82B]/60 bg-[#FFF9DF] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#2B3056] sm:inline-flex">
                    Riau
                  </span>
                </span>
                {!isScrolled && (
                  <span className="hidden truncate text-[10px] font-medium tracking-wide text-slate-500 sm:block">
                    Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
                  </span>
                )}
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative py-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-[#2B3056]"
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-0 rounded-full bg-[#FFC800] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Login CTA Button with Kemenkumham Gold Gradient */}
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] hover:brightness-105 font-bold text-[#2B3056] shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                  isScrolled ? 'h-9 px-4 text-[11px]' : 'h-10 px-5 text-xs'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                Masuk Petugas
              </Link>
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/login"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FFD82B] to-[#FFB943] px-3 text-[11px] font-bold text-[#2B3056] shadow-2xs"
              >
                <LogIn className="h-3 w-3" />
                Masuk
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#2B3056]"
                aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="border-t border-slate-100 pb-4 pt-2 lg:hidden">
              <nav className="space-y-1">
                {navLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#2B3056]"
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
