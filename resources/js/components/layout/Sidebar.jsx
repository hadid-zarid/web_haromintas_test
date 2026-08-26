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
      label: "Beranda",
      path: "/home",
      icon: Home,
    },
    {
      label: "Daftar Permohonan",
      path: "/peraturan",
      icon: FileText,
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
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2B3056]/80 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64
          bg-gradient-to-b from-[#2B3056] via-[#353B6A] to-[#2B3056]
          border-r border-[#3A4070]
          text-white
          flex flex-col justify-between
          transition-transform duration-200 ease-in-out font-sans
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Top Section */}
        <div className="overflow-y-auto">
          {/* Branding */}
          <div className="relative border-b border-white/10 px-5 pb-5 pt-6 text-center">
            {/* Mobile Close */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-slate-300 hover:text-white p-1 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="mx-auto mb-3 flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white p-1 shadow-md">
              <img
                src={logoHarmonitas}
                alt="Logo HARMONITAS"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Application Name */}
            <h2 className="text-xl font-bold tracking-wider text-white">
              HARMONITAS
            </h2>

            <p className="mt-1 px-1 text-[10px] font-semibold tracking-wide text-[#FFD82B]">
              Portal Operator Kanwil Riau
            </p>
          </div>

          {/* Main Navigation */}
          <nav className="p-3.5 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== '/home' && currentPath.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#FFD82B] to-[#FFB943] text-[#2B3056] shadow-md"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-[#2B3056]" : "text-white/80"
                      }`}
                    />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* AI Section */}
          <div className="px-3.5 mt-4">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-white/50">
              Layanan AI
            </p>

            <Link
              href="/ai"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isAiActive
                  ? "bg-gradient-to-r from-[#FFD82B] to-[#FFB943] text-[#2B3056] shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className={`w-4 h-4 shrink-0 ${isAiActive ? "text-[#2B3056]" : "text-[#FFD82B]"}`} />
                <span className="tracking-wide">Telaah AI</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isAiActive ? "bg-[#2B3056] text-[#FFD82B]" : "bg-[#FFD82B] text-[#2B3056]"}`}>
                Baru
              </span>
            </Link>
          </div>

          {/* Admin Section (if admin) */}
          {isAdmin && (
            <div className="px-3.5 mt-4">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFD82B]" />
                <span>Manajemen Sistem</span>
              </p>

              <Link
                href="/admin/users"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isManageAccountsActive
                    ? "bg-gradient-to-r from-[#FFD82B] to-[#FFB943] text-[#2B3056] shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="tracking-wide">Kelola Akun (Users)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[9px] font-black uppercase">
                  Admin
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Logout Section */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={onTriggerLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-[#E53935] hover:bg-[#D32F2F] text-white shadow-sm transition-all duration-150 cursor-pointer"
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
