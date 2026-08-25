import React from "react";
import { Link, usePage } from "@inertiajs/react";
import logoHarmonitas from "../../assets/LOGO HARMONITAS.png";

import {
  Home,
  FileText,
  BookOpen,
  LogOut,
  X,
  Sparkles,
  Bot,
  Users,
  ShieldCheck,
  FileOutput,
} from "lucide-react";

const Sidebar = ({ isMobileOpen, setIsMobileOpen, onTriggerLogout }) => {
  const { url, props } = usePage();
  const currentPath = url.split('?')[0];
  const authUser = props?.auth?.user;
  const isAdmin = authUser?.role === 'ADMIN';

  const navItems = [
    {
      label: "Dashboard",
      path: "/home",
      icon: Home,
    },
    {
      label: "Permohonan Peraturan",
      path: "/peraturan",
      icon: FileText,
    },
    {
      label: "Draft Generate Surat",
      path: "/draft-generate",
      icon: FileOutput,
    },
    {
      label: "Buku Panduan",
      path: "/panduan",
      icon: BookOpen,
    },
  ];

  const isAiActive = currentPath.startsWith("/ai");
  const isManageAccountsActive = currentPath.startsWith("/admin/users");

  return (
    <>
      {/* =========================================
          MOBILE BACKDROP
      ========================================= */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#101B4F]/65 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64
          bg-gradient-to-b from-[#303661] via-[#383F6F] to-[#454C7D]
          border-r border-white/10
          text-white
          flex flex-col justify-between
          transition-transform duration-200 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* =========================================
            TOP SECTION
        ========================================= */}
        <div className="overflow-y-auto">
          {/* =========================================
              BRANDING
          ========================================= */}
          <div className="relative border-b border-white/10 px-5 pb-5 pt-6 text-center">
            {/* Mobile Close */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-slate-300 hover:text-white p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="mx-auto mb-3 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white p-1 shadow-[0_10px_24px_rgba(8,14,49,0.24)]">
              <img
                src={logoHarmonitas}
                alt="Logo HARMONITAS"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Institution Badge */}
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[9px] font-bold text-white/85">
              <Sparkles className="w-3 h-3 text-[#FFC800]" />
              <span>Kanwil Kemenkum Riau</span>
            </div>

            {/* Application Name */}
            <h2 className="text-xl font-extrabold tracking-[0.12em] text-white">
              HARMONITAS
            </h2>

            <p className="mt-1 px-1 text-[9px] font-semibold leading-tight tracking-wide text-[#FFE76D]">
              Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
            </p>
          </div>

          {/* =========================================
              MAIN NAVIGATION
          ========================================= */}
          <nav className="p-3.5 space-y-1.5 mt-2">
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              Navigasi Utama
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== '/home' && currentPath.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#FFC800] text-[#101B4F] font-extrabold shadow-[0_8px_18px_rgba(8,14,49,0.2)]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-[#101B4F]" : "text-white/65"
                      }`}
                    />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* =========================================
              ADMIN SECTION (ONLY FOR ROLE === 'ADMIN')
          ========================================= */}
          {isAdmin && (
            <div className="px-3.5 mt-4">
              <p className="px-3 text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>Manajemen Sistem</span>
              </p>

              <Link
                href="/admin/users"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isManageAccountsActive
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black shadow-md"
                    : "text-purple-200 hover:bg-[#383F6A] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="tracking-wide">Kelola Akun (Users)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-200 text-[9px] font-black uppercase">
                  Admin
                </span>
              </Link>
            </div>
          )}

          {/* =========================================
              AI SECTION
          ========================================= */}
          <div className="px-3.5 mt-4">
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
              Layanan AI
            </p>

            <Link
              href="/ai"
              onClick={() => setIsMobileOpen(false)}
              className={`group relative block overflow-hidden rounded-xl transition-all duration-200 ${
                isAiActive ? "shadow-lg shadow-black/20" : "hover:shadow-md"
              }`}
            >
              <div
                className={`relative px-3.5 py-3 ${
                  isAiActive
                    ? "bg-[#FFC800]"
                    : "bg-white/[0.08] hover:bg-white/[0.13]"
                }`}
              >
                {/* Decorative Glow */}
                <div
                  className={`absolute -right-5 -top-5 w-16 h-16 rounded-full blur-xl ${
                    isAiActive ? "bg-white/30" : "bg-[#FFC800]/10"
                  }`}
                />

                <div className="relative flex items-center gap-3">
                  {/* AI Icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isAiActive
                        ? "bg-[#303661]"
                        : "bg-[#FFC800]/10 border border-[#FFC800]/20"
                    }`}
                  >
                    <Bot className="w-5 h-5 text-[#FFC800]" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-black ${
                        isAiActive ? "text-[#101B4F]" : "text-white"
                        }`}
                      >
                        HARMONITAS AI
                      </span>

                      <Sparkles
                        className={`w-3 h-3 ${
                          isAiActive ? "text-[#101B4F]" : "text-[#FFC800]"
                        }`}
                      />
                    </div>

                    <p
                      className={`text-[9px] mt-0.5 leading-tight ${
                        isAiActive ? "text-[#101B4F]/65" : "text-white/55"
                      }`}
                    >
                      Asisten AI peraturan
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {isAiActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#101B4F]" />
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* =========================================
            BOTTOM LOGOUT SECTION
        ========================================= */}
        <div className="border-t border-white/10 bg-[#252B56]/75 p-4">
          <button
            type="button"
            onClick={onTriggerLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30 transition-all duration-150"
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
