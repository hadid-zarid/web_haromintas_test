import React from "react";
import { NavLink } from "react-router-dom";
import logoHarmonitas from "../../assets/LOGO HARMONITAS.png";

import {
  Home,
  FileText,
  BookOpen,
  LogOut,
  X,
  Sparkles,
  Bot,
} from "lucide-react";

const Sidebar = ({ isMobileOpen, setIsMobileOpen, onTriggerLogout }) => {
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
      label: "Buku Panduan",
      path: "/panduan",
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* =========================================
          MOBILE BACKDROP
      ========================================= */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[#1A1A5E]/60 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64
          bg-[#2C3154]
          border-r border-[#383F6A]
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
          <div className="p-6 text-center border-b border-[#383F6A] relative">
            {/* Mobile Close */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-slate-300 hover:text-white p-1 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="mx-auto w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-3 border border-[#FFC800]/40 shadow-sm overflow-hidden">
              <img
                src={logoHarmonitas}
                alt="Logo HARMONITAS"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Institution Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#383F6A] border border-white/10 text-white text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-[#FFC800]" />

              <span>Kanwil Kemenkum Riau</span>
            </div>

            {/* Application Name */}
            <h2 className="text-xl font-black tracking-wider text-white">
              HARMONITAS
            </h2>

            <p className="text-[10px] text-[#FFC800] leading-tight mt-0.5 px-1 font-bold tracking-wide">
              Harmonisasi dan Fasilitasi Ranperda dan Ranperkada Tuntas
            </p>
          </div>

          {/* =========================================
              MAIN NAVIGATION
          ========================================= */}
          <nav className="p-3.5 space-y-1.5 mt-2">
            <p className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
              Navigasi Utama
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-[#1A1A5E] font-black shadow-md"
                        : "text-slate-200 hover:bg-[#383F6A] hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-[#1A1A5E]" : "text-slate-300"
                        }`}
                      />

                      <span className="tracking-wide">{item.label}</span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* =========================================
              AI SECTION
          ========================================= */}
          <div className="px-3.5 mt-4">
            <p className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">
              Layanan AI
            </p>

            <NavLink
              to="/ai"
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `group relative block overflow-hidden rounded-xl transition-all duration-200 ${
                  isActive ? "shadow-lg shadow-black/20" : "hover:shadow-md"
                }`
              }
            >
              {({ isActive }) => (
                <div
                  className={`relative px-3.5 py-3 ${
                    isActive
                      ? "bg-gradient-to-r from-[#FFD54F] to-[#FFB300]"
                      : "bg-gradient-to-r from-[#383F6A] to-[#343A61] hover:from-[#454C75] hover:to-[#3B426B]"
                  }`}
                >
                  {/* Decorative Glow */}
                  <div
                    className={`absolute -right-5 -top-5 w-16 h-16 rounded-full blur-xl ${
                      isActive ? "bg-white/30" : "bg-[#FFC800]/10"
                    }`}
                  />

                  <div className="relative flex items-center gap-3">
                    {/* AI Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-[#2C3154]"
                          : "bg-[#FFC800]/10 border border-[#FFC800]/20"
                      }`}
                    >
                      <Bot
                        className={`w-5 h-5 ${
                          isActive ? "text-[#FFC800]" : "text-[#FFC800]"
                        }`}
                      />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-black ${
                            isActive ? "text-[#1A1A5E]" : "text-white"
                          }`}
                        >
                          HARMONITAS AI
                        </span>

                        <Sparkles
                          className={`w-3 h-3 ${
                            isActive ? "text-[#1A1A5E]" : "text-[#FFC800]"
                          }`}
                        />
                      </div>

                      <p
                        className={`text-[9px] mt-0.5 leading-tight ${
                          isActive ? "text-[#1A1A5E]/70" : "text-slate-300"
                        }`}
                      >
                        Asisten AI peraturan
                      </p>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A5E] shrink-0" />
                    )}
                  </div>
                </div>
              )}
            </NavLink>
          </div>
        </div>

        {/* =========================================
            BOTTOM LOGOUT SECTION
        ========================================= */}
        <div className="p-4 border-t border-[#383F6A] bg-[#222645]">
          {/* Logout */}
          <button
            type="button"
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