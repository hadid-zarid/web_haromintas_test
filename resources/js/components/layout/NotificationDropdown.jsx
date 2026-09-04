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
  ExternalLink,
  ShieldCheck,
  BellRing,
  Inbox
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
        bgColor: 'bg-purple-50 text-purple-600 border-purple-200',
        badgeColor: 'bg-purple-100 text-purple-800',
      };
    }
    return {
      icon: FileText,
      bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800',
    };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Animation */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all duration-200 focus:outline-none cursor-pointer border ${
          isOpen 
            ? 'bg-[#2B3056] text-[#FFD82B] border-[#2B3056] shadow-sm' 
            : 'border-slate-200 bg-slate-50 text-[#2B3056] hover:bg-white hover:border-[#2B3056]/30 hover:shadow-2xs'
        }`}
        title="Pemberitahuan Notifikasi"
        aria-label="Buka notifikasi"
      >
        <Bell className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-xs animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel with Smooth Entrance Animation.
          Mobile (<sm): fixed & dijangkarkan ke tepi VIEWPORT (bukan ke tombol lonceng) —
          tombol lonceng tidak selalu di ujung kanan layar, jadi anchor ke tombol bisa
          mendorong panel keluar dari tepi kiri layar pada layar sempit.
          Desktop (>=sm): kembali ke pola dropdown biasa, menempel di bawah tombol. */}
      {isOpen && (
        <div className="fixed inset-x-3 top-[64px] sm:absolute sm:inset-x-auto sm:top-[calc(100%+0.5rem)] sm:right-0 z-50 w-auto sm:w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_40px_rgba(43,48,86,0.14)] animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-[#2B3056] text-white">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 text-[#FFD82B] flex items-center justify-center">
                <BellRing className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-extrabold text-xs text-white">Pemberitahuan</h3>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.2 rounded-full shadow-2xs">
                  {unreadCount} Baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button 
                type="button"
                onClick={handleMarkAllRead}
                className="text-[10.5px] font-bold text-[#FFD82B] hover:underline transition flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Tandai dibaca</span>
              </button>
            )}
          </div>

          {/* Segmented Pill Tabs */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs">
              <button 
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-center font-bold text-[11px] transition-all cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-white text-[#2B3056] shadow-2xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('unread')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-center font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'unread' 
                    ? 'bg-white text-[#2B3056] shadow-2xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Belum Dibaca</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[8.5px] font-black">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notification List Body */}
          <div className="max-h-[60vh] sm:max-h-[20rem] overflow-y-auto divide-y divide-slate-100">
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
                        : 'hover:bg-slate-50/90 bg-white'
                    }`}
                  >
                    {/* Visual Icon */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${visual.bgColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs truncate ${isUnread ? 'font-black text-[#2B3056]' : 'font-bold text-slate-700'}`}>
                          {notif.judul}
                        </p>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5 line-clamp-2 font-medium">
                        {notif.pesan}
                      </p>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-300" />
                          {notif.time_ago || 'Baru saja'}
                        </span>
                        {notif.rancangan_id && (
                          <span className="text-[10px] font-bold text-blue-700 flex items-center gap-0.5 hover:underline">
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
              <div className="py-8 px-4 text-center space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#2B3056] border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
                  <Sparkles className="w-5 h-5 text-[#FFC800]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#2B3056]">Semua Notifikasi Terbaca</p>
                  <p className="text-[10.5px] text-slate-400 font-medium mt-0.5 max-w-[200px] mx-auto">
                    {activeTab === 'unread' ? 'Tidak ada pemberitahuan baru yang belum Anda baca.' : 'Belum ada notifikasi baru di sistem.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[9.5px] font-semibold text-slate-400">
              Notifikasi diperbarui otomatis sesuai alur regulasi
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
