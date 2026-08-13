import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import RoleBadge from "../common/RoleBadge";

import { useAuth } from "../../context/AuthContext";

import SessionTimeoutModal from "../modals/SessionTimeoutModal";
import NotificationDropdown from "./NotificationDropdown";

import { Building2, ChevronDown, IdCard, Menu, User } from "lucide-react";

export const AppLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const { user, role } = useAuth();
  const location = useLocation();

  /* =========================================
     CLOSE PROFILE DROPDOWN
  ========================================== */
  useEffect(() => {
    if (!isProfileOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  /* =========================================
     PAGE TITLE
  ========================================== */
  const getHeaderTitle = (pathname) => {
    if (pathname === "/home") {
      return "Dashboard";
    }

    if (pathname.includes("/peraturan/")) {
      return "Detail Permohonan Peraturan";
    }

    if (pathname === "/peraturan") {
      return "Permohonan Peraturan";
    }

    if (pathname === "/panduan") {
      return "Buku Panduan";
    }

    if (pathname === "/ai") {
      return "HARMONITAS AI";
    }

    return "Dashboard";
  };

  const displayName = user?.name || "Operator Kanwil Kemenkum";
  const displayUnit = user?.unit || "Kementerian Hukum & HAM Riau";
  const displayNip = user?.nip || "-";

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#3D3D3A] flex">
      {/* =====================================
          SIDEBAR
      ====================================== */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onTriggerLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* =====================================
          MAIN AREA
      ====================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* =================================
            HEADER
        ================================== */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E2E2DC] flex items-center justify-between px-4 sm:px-8">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                setIsMobileOpen(true);
              }}
              className="lg:hidden p-2 rounded-lg text-[#1A1A5E] flat-btn-secondary focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User Greeting */}
            <div className="min-w-0">
              <h1 className="text-sm font-black text-[#1A1A5E] truncate">
                {displayName}
              </h1>
              <p className="text-[11px] text-[#3D3D3A]/70 font-semibold truncate">
                {displayUnit}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5 shrink-0">
            <NotificationDropdown />

            {/* Account Dropdown */}
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className={`flex h-10 items-center gap-2 rounded-xl border px-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFC800]/40 ${
                  isProfileOpen
                    ? "border-[#1A1A5E]/20 bg-[#1A1A5E] text-white shadow-md"
                    : "border-[#E2E2DC] bg-[#F8F8F5] text-[#1A1A5E] hover:border-[#1A1A5E]/20 hover:bg-white"
                }`}
                title="Informasi akun"
                aria-label="Buka informasi akun"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg ${
                    isProfileOpen ? "bg-white/15" : "bg-[#EAEAE2]"
                  }`}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </span>
                <ChevronDown
                  className={`hidden h-3.5 w-3.5 transition-transform duration-200 sm:block ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E2E2DC] bg-white shadow-[0_20px_55px_rgba(26,26,94,0.18)]"
                  role="menu"
                  aria-label="Informasi akun pengguna"
                >
                  {/* Profile Header */}
                  <div className="relative overflow-hidden bg-[#1A1A5E] p-5 text-white">
                    <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#FFC800]/15 blur-2xl" />

                    <div className="relative flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#FFC800] bg-white/10">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="truncate text-sm font-black">
                          {displayName}
                        </p>
                        <p className="mt-1 truncate text-[11px] font-semibold text-slate-300">
                          {displayUnit}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-black text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-3 p-4">
                    <div className="rounded-xl border border-[#E2E2DC] bg-[#F8F8F5] p-3.5">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1A1A5E] shadow-sm">
                          <IdCard className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#3D3D3A]/55">
                            Nomor Induk Pegawai
                          </p>
                          <p className="mt-1 break-words text-xs font-black text-[#1A1A5E]">
                            {displayNip}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E2E2DC] bg-[#F8F8F5] p-3.5">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1A1A5E] shadow-sm">
                          <Building2 className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#3D3D3A]/55">
                            Unit Kerja
                          </p>
                          <p className="mt-1 text-xs font-bold leading-relaxed text-[#3D3D3A]">
                            {displayUnit}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#E2E2DC] px-1 pt-3">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#3D3D3A]/55">
                          Hak Akses
                        </p>
                        <div className="mt-1.5">
                          <RoleBadge role={role} />
                        </div>
                      </div>
                      <p className="max-w-[130px] text-right text-[9px] font-semibold leading-relaxed text-[#3D3D3A]/55">
                        Gunakan tombol logout pada sidebar untuk keluar.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================================
            MAIN CONTENT
        ================================== */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A5E] tracking-tight">
              {getHeaderTitle(location.pathname)}
            </h2>

            {/* Yellow Accent */}
            <div className="h-1.5 w-16 bg-[#FFC800] rounded-full mt-2" />

            {/* Breadcrumb */}
            <div className="mt-2.5">
              <Breadcrumb />
            </div>
          </div>

          {/* PAGE CONTENT */}
          {children}
        </main>
      </div>

      {/* =====================================
          LOGOUT MODAL
      ====================================== */}
      <SessionTimeoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default AppLayout;