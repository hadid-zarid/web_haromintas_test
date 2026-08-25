import React, { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { 
  Bell, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  Clock, 
  Layers, 
  Sparkles,
  Check,
  ExternalLink
} from 'lucide-react';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);

  const { props } = usePage();
  const notifications = props.notifications || [];
  const unreadCount = props.unread_notifications_count || 0;
  const user = props.auth?.user;
  const isAdmin = user?.role === 'ADMIN' || user?.role_id === 1;

  // Tutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const displayedNotifications = activeTab === 'unread' ? unreadNotifications : notifications;

  // Handler Tandai Semua Dibaca
  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    if (unreadCount === 0) return;
    
    router.post('/notifikasi/read-all', {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  // Handler Klik Notifikasi Item
  const handleNotificationClick = (notif) => {
    setIsOpen(false);
    
    if (!notif.is_read) {
      router.post(`/notifikasi/${notif.id || notif.notifikasi_id}/read`, {}, {
        preserveScroll: true,
        preserveState: true,
      });
    }

    if (notif.rancangan_id) {
      router.visit(`/peraturan/${notif.rancangan_id}`);
    }
  };

  // Helper Ikon dan Warna berdasarkan Judul Notifikasi
  const getNotificationVisuals = (judul = '') => {
    const j = judul.toLowerCase();
    if (j.includes('selesai') || j.includes('disetujui')) {
      return {
        icon: CheckCircle2,
        bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        badgeColor: 'bg-emerald-100 text-emerald-800',
      };
    }
    if (j.includes('perbaikan') || j.includes('revisi') || j.includes('tolak')) {
      return {
        icon: AlertCircle,
        bgColor: 'bg-rose-50 text-rose-600 border-rose-200',
        badgeColor: 'bg-rose-100 text-rose-800',
      };
    }
    if (j.includes('fasilitasi') || j.includes('siap')) {
      return {
        icon: Layers,
        bgColor: 'bg-sky-50 text-sky-600 border-sky-200',
        badgeColor: 'bg-sky-100 text-sky-800',
      };
    }
    return {
      icon: FileText,
      bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    };
  };

  // Jika akun adalah Admin, tampilkan notifikasi khusus sistem atau mode pasif
  if (isAdmin) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-xl transition-all duration-200 focus:outline-none border ${
            isOpen 
              ? 'bg-[#303661] text-white border-[#303661]' 
              : 'border-[#E2E6EF] bg-[#F7F8FC] text-[#303661] hover:bg-white hover:border-[#303661]/20'
          }`}
          title="Notifikasi Sistem"
          aria-label="Buka notifikasi"
        >
          <Bell className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(26,26,94,0.15)] border border-[#E2E6EF] z-50 overflow-hidden">
            <div className="p-4 border-b border-[#E2E6EF] bg-slate-50/70">
              <h3 className="font-extrabold text-[#1A1A5E] text-xs">Pemberitahuan Sistem</h3>
            </div>
            <div className="p-6 text-center text-xs text-slate-500">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                <Bell className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-700">Akun Administrator Sistem</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Notifikasi alur operasional ditujukan secara spesifik untuk Biro Hukum dan Tim Kerja Kanwil.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-200 focus:outline-none border ${
          isOpen 
            ? 'bg-[#303661] text-white border-[#303661]' 
            : 'border-[#E2E6EF] bg-[#F7F8FC] text-[#303661] hover:bg-white hover:border-[#303661]/20'
        }`}
        title="Notifikasi"
        aria-label="Buka notifikasi"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[min(24rem,calc(100vw-2rem))] bg-white rounded-2xl shadow-[0_22px_58px_rgba(26,26,94,0.18)] border border-[#E2E6EF] z-50 overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E2E6EF] bg-slate-50/80">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-[#1A1A5E] text-xs">Pemberitahuan</h3>
              {unreadCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                  {unreadCount} Baru
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Tandai dibaca</span>
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-4 px-4 border-b border-[#E2E6EF] bg-white text-xs">
            <button 
              type="button"
              onClick={() => setActiveTab('all')}
              className={`py-2.5 font-extrabold border-b-2 transition-all ${
                activeTab === 'all' 
                  ? 'border-[#303661] text-[#303661]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`py-2.5 font-extrabold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'unread' 
                  ? 'border-[#303661] text-[#303661]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>Belum Dibaca</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-black">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[22rem] overflow-y-auto divide-y divide-slate-100">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notif) => {
                const visual = getNotificationVisuals(notif.judul);
                const IconComponent = visual.icon;
                const isUnread = !notif.is_read;

                return (
                  <div 
                    key={notif.id || notif.notifikasi_id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer text-left ${
                      isUnread 
                        ? 'bg-blue-50/40 hover:bg-blue-50/70' 
                        : 'hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    {/* Visual Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${visual.bgColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs truncate ${isUnread ? 'font-black text-[#1A1A5E]' : 'font-bold text-slate-700'}`}>
                          {notif.judul}
                        </p>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 line-clamp-2">
                        {notif.pesan}
                      </p>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          {notif.time_ago || 'Baru saja'}
                        </span>
                        {notif.rancangan_id && (
                          <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 hover:underline">
                            <span>Buka Berkas</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">Tidak ada notifikasi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeTab === 'unread' ? 'Semua notifikasi telah Anda baca.' : 'Belum ada notifikasi baru untuk Anda.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-[#E2E6EF] text-center">
            <p className="text-[10px] font-semibold text-slate-500">
              Notifikasi diperbarui otomatis sesuai alur kerja regulasi
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
