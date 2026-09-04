import React, { useEffect, useRef, useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";

import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
import RoleBadge from "../common/RoleBadge";
import HarmonitasLoader from "../common/HarmonitasLoader";

import { useAuth } from "../../context/AuthContext";

import SessionTimeoutModal from "../modals/SessionTimeoutModal";
import NotificationDropdown from "./NotificationDropdown";

import {
  Building2,
  ChevronDown,
  ChevronRight,
  FileText,
  BookOpen,
  IdCard,
  LogOut,
  Menu,
  Sparkles,
  User,
} from "lucide-react";

export const AppLayout = ({
  children,
  title,
  subtitle,
  headerAction,
  hideHeader = false,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const profileMenuRef = useRef(null);
  const { user, role } = useAuth();
  const { url } = usePage();
  const pathname = url.split('?')[0];

  /* =========================================
     GLOBAL INERTIA NAVIGATION LOADER LISTENER
  ========================================== */
  useEffect(() => {
    const unregisterStart = router.on("start", () => setIsNavigating(true));
    const unregisterFinish = router.on("finish", () => setIsNavigating(false));

    return () => {
      unregisterStart();
      unregisterFinish();
    };
  }, []);

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

  const displayName = user?.name || user?.nama || "Operator Kanwil Kemenkum";
  const displayEmail = user?.email || "operator@kemenkumham.go.id";
  const displayUnit = user?.unit || user?.unit_kerja || "Kementerian Hukum & HAM Riau";
  const displayNip = user?.nip || "-";

  return (
    <div className="flex min-h-screen bg-[#F7F8FC] text-[#20283D] font-sans">
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

            {/* Account Trigger & Dropdown */}
            <div ref={profileMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className={`group flex h-10 items-center gap-2 rounded-xl px-2.5 transition-all duration-200 border cursor-pointer select-none ${
                  isProfileOpen
                    ? "border-[#2B3056] bg-[#2B3056] text-white shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:border-slate-300"
                }`}
                title="Menu Akun"
                aria-label="Buka informasi akun"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
              >
                <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-[#FFD82B]/60 bg-white/20 shrink-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <span className="hidden sm:block text-xs font-bold truncate max-w-[120px]">
                  {displayName.split(" ")[0]}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isProfileOpen ? "rotate-180 text-[#FFD82B]" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Account Dropdown Panel — dijangkarkan ke tepi viewport pada mobile
                  (pola sama dengan NotificationDropdown) agar tidak pernah keluar layar
                  pada layar yang sangat sempit. */}
              {isProfileOpen && (
                <div
                  className="fixed inset-x-3 top-[76px] sm:absolute sm:inset-x-auto sm:top-[calc(100%+0.5rem)] sm:right-0 z-50 w-auto sm:w-[275px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-[0_16px_40px_rgba(43,48,86,0.12)] animate-in fade-in zoom-in-95 duration-150 origin-top-right space-y-3"
                  role="menu"
                  aria-label="Informasi akun pengguna"
                >
                  {/* User Identity Row */}
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[#FFD82B] bg-[#2B3056] text-white shadow-2xs">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[#2B3056] truncate">
                        {displayName}
                      </p>
                      <p className="text-[10.5px] text-slate-400 font-medium truncate mt-0.5">
                        {displayEmail}
                      </p>
                      <div className="mt-1">
                        <RoleBadge role={role} />
                      </div>
                    </div>
                  </div>

                  {/* Metadata Mini Chip */}
                  <div className="space-y-1.5 py-0.5">
                    <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                        <IdCard className="w-3.5 h-3.5 text-[#2B3056]" />
                        <span>NIP Pegawai</span>
                      </span>
                      <span className="font-mono font-bold text-[#2B3056] text-[10.5px]">
                        {displayNip}
                      </span>
                    </div>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Keluar dari Akun</span>
                      </span>
                      <span className="text-[10px] text-rose-400">Logout</span>
                    </button>
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
          {/* Unified Page Header */}
          {!hideHeader && (
            <div className="mb-6 space-y-2.5">
              {/* Breadcrumb Navigation */}
              <div>
                <Breadcrumb />
              </div>

              {/* Title & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B3056] tracking-tight">
                    {getHeaderTitle(pathname)}
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>

                {headerAction && (
                  <div className="shrink-0">
                    {headerAction}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAGE CONTENT */}
          {children}
        </main>
      </div>

      {/* =====================================
          GLOBAL TOP LASER LOADING BAR
      ====================================== */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] overflow-hidden pointer-events-none">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[#FFD82B] to-[#FFB943] shadow-[0_0_10px_#FFD82B] animate-laser-scan" />
        </div>
      )}

      {/* =====================================
          GLOBAL FLOATING QUANTUM SYNC PILL
      ====================================== */}
      {isNavigating && (
        <div className="fixed bottom-5 right-5 z-[9999] pointer-events-none animate-fadeIn">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#2B3056]/95 text-white backdrop-blur-md border border-[#FFD82B]/30 shadow-2xl">
            <HarmonitasLoader variant="button" />
            <span className="text-xs font-black tracking-wide text-[#FFD82B]">Sinkronisasi HARMONITAS...</span>
          </div>
        </div>
      )}

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
