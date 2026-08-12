import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import RoleBadge from '../common/RoleBadge';

import { useAuth } from '../../context/AuthContext';

import SessionTimeoutModal from '../modals/SessionTimeoutModal';
import NotificationDropdown from './NotificationDropdown';

import {
  Menu,
  User,
} from 'lucide-react';


export const AppLayout = ({ children }) => {

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { user, role } = useAuth();

  const location = useLocation();


  /* =========================================
     PAGE TITLE
  ========================================== */

  const getHeaderTitle = (pathname) => {

    if (pathname === '/home') {
      return 'Dashboard';
    }

    if (pathname.includes('/peraturan/')) {
      return 'Detail Permohonan Peraturan';
    }

    if (pathname === '/peraturan') {
      return 'Permohonan Peraturan';
    }

    if (pathname === '/panduan') {
      return 'Buku Panduan';
    }

    if (pathname === '/ai') {
      return 'HARMONITAS AI';
    }

    return 'Dashboard';
  };


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
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#1A1A5E] flat-btn-secondary focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>


            {/* User */}
            <div className="min-w-0">

              <h1 className="text-sm font-black text-[#1A1A5E] truncate">
                {user?.name || 'Operator Kanwil Kemenkum'}
              </h1>

              <p className="text-[11px] text-[#3D3D3A]/70 font-semibold truncate">
                {user?.unit || 'Kementerian Hukum & HAM Riau'}
              </p>

            </div>

          </div>


          {/* Right */}
          <div className="flex items-center gap-2.5 shrink-0">

            <RoleBadge role={role} />

            <NotificationDropdown />

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 rounded-lg text-[#1A1A5E] flat-btn-secondary"
              title="Sesi Pengguna"
            >
              <User className="w-4 h-4" />
            </button>

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