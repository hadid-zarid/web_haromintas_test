import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, FileText, User, MessageSquare } from 'lucide-react';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const dropdownRef = useRef(null);

  // Dummy data disesuaikan dengan konteks aplikasi HARMONITAS
  const notifications = [
    {
      id: 1,
      user: 'Biro Hukum Riau',
      avatar: 'https://ui-avatars.com/api/?name=Biro+Hukum&background=0D8ABC&color=fff',
      action: 'mengunggah Surat Hasil Fasilitasi untuk Ranperda Pajak Daerah.',
      time: '2 menit yang lalu',
      unread: true,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500'
    },
    {
      id: 2,
      user: 'Kabupaten Siak',
      avatar: 'https://ui-avatars.com/api/?name=Kab+Siak&background=FFC800&color=fff',
      action: 'mengajukan permohonan harmonisasi Ranperda baru.',
      time: '15 menit yang lalu',
      unread: true,
      icon: FileText,
      iconColor: 'text-blue-500'
    },
    {
      id: 3,
      user: 'Tim Pokja 1',
      avatar: 'https://ui-avatars.com/api/?name=Pokja+1&background=1A1A5E&color=fff',
      action: 'menyelesaikan draf harmonisasi Ranperkada Retribusi.',
      time: '2 jam yang lalu',
      unread: false,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500'
    },
    {
      id: 4,
      user: 'Biro Hukum Riau',
      avatar: 'https://ui-avatars.com/api/?name=Biro+Hukum&background=0D8ABC&color=fff',
      action: 'memberikan catatan revisi pada pasal 4 Ranperda RTRW.',
      time: 'Kemarin',
      unread: false,
      icon: MessageSquare,
      iconColor: 'text-amber-500'
    }
  ];

  // click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayedNotifications = activeTab === 'unread' 
    ? notifications.filter(n => n.unread)
    : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors focus:outline-none ${isOpen ? 'bg-slate-100 text-[#1A1A5E]' : 'text-[#1A1A5E] flat-btn-secondary'}`}
        title="Notifikasi"
      >
        <Bell className="w-4 h-4" />
        {notifications.some(n => n.unread) && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-black text-[#1A1A5E] text-base">Notifikasi</h3>
            <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800">
              Tandai semua dibaca
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 px-4 border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('all')}
              className={`py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === 'all' ? 'border-[#1A1A5E] text-[#1A1A5E]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Semua Notifikasi
            </button>
            <button 
              onClick={() => setActiveTab('unread')}
              className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'unread' ? 'border-[#1A1A5E] text-[#1A1A5E]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Belum Dibaca
              <span className="bg-slate-100 text-slate-600 py-0.5 px-1.5 rounded-md text-[10px]">{notifications.filter(n => n.unread).length}</span>
            </button>
          </div>

          {/* List */}
          <div className="max-h-[28rem] overflow-y-auto">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map(notif => (
                <div key={notif.id} className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0 ${notif.unread ? 'bg-blue-50/30' : ''}`}>
                  <div className="relative shrink-0">
                    <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <notif.icon className={`w-3.5 h-3.5 ${notif.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-[#1A1A5E] mr-1">{notif.user}</span>
                      {notif.action}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">{notif.time}</p>
                  </div>
                  {notif.unread && (
                    <div className="shrink-0 flex items-center justify-center mt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs font-semibold text-slate-500">
                Tidak ada notifikasi
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
