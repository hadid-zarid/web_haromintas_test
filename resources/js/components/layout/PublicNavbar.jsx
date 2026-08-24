import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Globe2, LogIn, Mail, Menu, Phone, X } from 'lucide-react';
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
    <header className="sticky top-0 z-50 shadow-[0_8px_24px_rgba(28,36,81,0.06)]">
      <div className="hidden bg-gradient-to-r from-[#101B4F] to-[#303661] text-white sm:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-[10px] font-semibold sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-[#FFC800]" />
              harmonitas.kanwil@kemenkum.go.id
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-[#FFC800]" />
              (0761) 853000
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-white/80">
            <Globe2 className="h-3 w-3 text-[#FFC800]" />
            ID
            <span className="text-white/35">|</span>
            EN
          </span>
        </div>
      </div>

      <div className="border-b border-[#E2E6EF] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E2E6EF] bg-white p-1 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <img
                src={logoHarmonitas}
                alt="Logo HARMONITAS"
                className="h-full w-full object-contain"
              />
            </span>

            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold tracking-[0.08em] text-[#303661]">
                  HARMONITAS
                </span>
                <span className="hidden rounded-full bg-[#FFF3B8] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#7B6100] sm:inline-flex">
                  Riau
                </span>
              </span>
              <span className="hidden truncate text-[9px] font-semibold tracking-wide text-[#6F778B] sm:block">
                Harmonisasi dan Fasilitasi Ranperda & Ranperkada Tuntas
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group relative py-2 text-[12px] font-bold text-[#4E566B] transition-colors hover:text-[#303661]"
              >
                {item.name}
                <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-0 rounded-full bg-[#FFC800] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#303661] to-[#454C7D] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(48,54,97,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_11px_24px_rgba(48,54,97,0.28)]"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#303661] px-3 text-[11px] font-bold text-white shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              Masuk
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E2E6EF] bg-[#F7F8FC] text-[#303661]"
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-[#E2E6EF] bg-white px-4 pb-5 pt-2 shadow-lg lg:hidden">
          <nav className="mx-auto max-w-7xl space-y-1">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#4E566B] transition-colors hover:bg-[#EEF1F8] hover:text-[#303661]"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
