import React, { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";

import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import RoleBadge from "../common/RoleBadge";

import { useAuth } from "../../context/AuthContext";

import SessionTimeoutModal from "../modals/SessionTimeoutModal";
import NotificationDropdown from "./NotificationDropdown";

import { Building2, ChevronDown, IdCard, Menu, User } from "lucide-react";

export const AppLayout = ({ children, title }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const { user, role } = useAuth();
  const { url } = usePage();
  const pathname = url.split('?')[0];

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
  const getHeaderTitle = (currentPath) => {
    if (title) {
      return title;
    }

    if (currentPath === "/home") {
      return "Dashboard";
    }

    if (currentPath.startsWith("/admin/users")) {
      return "Manajemen Akun & Hak Akses (RBAC)";
    }

    if (currentPath.includes("/peraturan/")) {
      return "Detail Permohonan Peraturan";
    }

    if (currentPath === "/peraturan") {
      return "Permohonan Peraturan";
    }

    if (currentPath === "/draft-generate") {
      return "Draft Generate Surat";
    }

    if (currentPath === "/panduan") {
      return "Buku Panduan";
    }

    if (currentPath === "/ai") {
      return "HARMONITAS AI";
    }

    return "Dashboard";
  };

  const displayName = user?.name || "Operator Kanwil Kemenkum";
  const displayUnit = user?.unit || "Kementerian Hukum & HAM Riau";
  const displayNip = user?.nip || "-";

  return (
    <div className="flex min-h-screen bg-[#F7F8FC] text-[#20283D]">
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
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E2E6EF] bg-white/95 px-4 shadow-[0_5px_18px_rgba(30,39,89,0.04)] backdrop-blur-xl sm:px-8">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                setIsMobileOpen(true);
              }}
              className="flat-btn-secondary rounded-xl p-2 text-[#303661] focus:outline-none lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User Greeting */}
            <div className="min-w-0">
              <h1 className="truncate text-sm font-extrabold text-[#20283D]">
                {displayName}
              </h1>
              <p className="truncate text-[10px] font-semibold text-[#7A8294]">
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
                    ? "border-[#303661]/20 bg-[#303661] text-white shadow-md"
                    : "border-[#E2E6EF] bg-[#F7F8FC] text-[#303661] hover:border-[#303661]/20 hover:bg-white"
                }`}
                title="Informasi akun"
                aria-label="Buka informasi akun"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg ${
                    isProfileOpen ? "bg-white/15" : "bg-[#EEF1F8]"
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
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-[20px] border border-[#E2E6EF] bg-white shadow-[0_22px_58px_rgba(26,26,94,0.18)]"
                  role="menu"
                  aria-label="Informasi akun pengguna"
                >
                  {/* Profile Header */}
                  <div className="relative overflow-hidden bg-gradient-to-r from-[#303661] to-[#4B5286] p-5 text-white">
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
                    <div className="rounded-xl border border-[#E2E6EF] bg-[#F7F8FC] p-3.5">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#303661] shadow-sm">
                          <IdCard className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#3D3D3A]/55">
                            Nomor Induk Pegawai
                          </p>
                          <p className="mt-1 break-words text-xs font-extrabold text-[#303661]">
                            {displayNip}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E2E6EF] bg-[#F7F8FC] p-3.5">
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#303661] shadow-sm">
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

                    <div className="flex items-center justify-between border-t border-[#E2E6EF] px-1 pt-3">
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-7 lg:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A5E] tracking-tight">
              {getHeaderTitle(pathname)}
            </h2>

            {/* Yellow Accent */}
            <div className="mt-2 h-1 w-14 rounded-full bg-[#FFC800]" />

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
