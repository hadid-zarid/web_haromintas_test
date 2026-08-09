import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePeraturan } from '../context/PeraturanContext';
import AppLayout from '../components/layout/AppLayout';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import AddPeraturanModal from '../components/modals/AddPeraturanModal';
import AdvancedFilterModal from '../components/modals/AdvancedFilterModal';
import { 
  Search, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  SlidersHorizontal
} from 'lucide-react';
import { KABUPATEN_LIST, JENIS_PERATURAN, STATUS_PERATURAN } from '../mock/mockPeraturan';

export const PeraturanListPage = () => {
  const { role: currentRole } = useAuth();
  const { peraturanList, readIds, markAsRead } = usePeraturan();
  const navigate = useNavigate();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKabupaten, setSelectedKabupaten] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    kabupaten: '',
    status: '',
    jenis: '',
    proja: '',
    startDate: '',
    endDate: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter Data Logic per Role + Search + Filters
  const filteredData = useMemo(() => {
    return peraturanList.filter((item) => {
      if (['Proja 1', 'Proja 2', 'Proja 3'].includes(currentRole)) {
        if (item.proja !== currentRole) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesJudul = item.judul.toLowerCase().includes(q);
        const matchesNomor = item.nomor.toLowerCase().includes(q);
        if (!matchesJudul && !matchesNomor) return false;
      }

      if (selectedKabupaten && item.kabupaten !== selectedKabupaten) return false;
      if (selectedStatus && item.status !== selectedStatus) return false;
      if (selectedJenis && item.jenis !== selectedJenis) return false;

      if (advancedFilters.kabupaten && item.kabupaten !== advancedFilters.kabupaten) return false;
      if (advancedFilters.status && item.status !== advancedFilters.status) return false;
      if (advancedFilters.jenis && item.jenis !== advancedFilters.jenis) return false;
      if (advancedFilters.proja && item.proja !== advancedFilters.proja) return false;

      return true;
    });
  }, [peraturanList, currentRole, searchQuery, selectedKabupaten, selectedStatus, selectedJenis, advancedFilters]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const canAddPeraturan = ['Proja 1', 'Proja 2', 'Proja 3'].includes(currentRole);

  const handleRowClick = (id) => {
    markAsRead(id);
    navigate(`/peraturan/${id}`);
  };

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedKabupaten('');
    setSelectedStatus('');
    setSelectedJenis('');
    setAdvancedFilters({ kabupaten: '', status: '', jenis: '', proja: '', startDate: '', endDate: '' });
    setCurrentPage(1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Control Bar Flat 2.0 */}
        <div className="flat-card p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input Flat */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari berdasarkan judul atau nomor peraturan..."
                className="w-full text-xs pl-10 pr-4 py-2.5 flat-input text-slate-800 font-semibold"
              />
            </div>

            {/* Quick Dropdown Filters Flat */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedKabupaten}
                onChange={(e) => { setSelectedKabupaten(e.target.value); setCurrentPage(1); }}
                className="text-xs p-2.5 flat-input font-bold text-slate-800"
              >
                <option value="">Semua Kabupaten/Kota</option>
                {KABUPATEN_LIST.map(k => <option key={k} value={k}>{k}</option>)}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="text-xs p-2.5 flat-input font-bold text-slate-800"
              >
                <option value="">Semua Status</option>
                {Object.values(STATUS_PERATURAN).map(s => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>

              <select
                value={selectedJenis}
                onChange={(e) => { setSelectedJenis(e.target.value); setCurrentPage(1); }}
                className="text-xs p-2.5 flat-input font-bold text-slate-800"
              >
                <option value="">Semua Jenis</option>
                {JENIS_PERATURAN.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-3.5 py-2.5 text-xs font-bold flat-btn-secondary flex items-center gap-1.5"
                title="Filter Lanjutan"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">Filter Lanjutan</span>
              </button>

              {(searchQuery || selectedKabupaten || selectedStatus || selectedJenis || advancedFilters.kabupaten) && (
                <button
                  onClick={handleResetAllFilters}
                  className="px-3 py-2.5 text-xs font-bold flat-btn-danger flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* "+ Tambah Peraturan" Button Flat */}
            {canAddPeraturan && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 flat-btn-amber text-white font-bold text-xs flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Tambah Peraturan</span>
              </button>
            )}
          </div>
        </div>

        {/* Datatable Flat 2.0 Container */}
        <div className="flat-card overflow-hidden">
          {paginatedData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">Status Baca</th>
                    <th className="py-3.5 px-4">Nomor Berkas</th>
                    <th className="py-3.5 px-4">Judul Peraturan</th>
                    <th className="py-3.5 px-4">Kabupaten / Kota</th>
                    <th className="py-3.5 px-4">Jenis</th>
                    <th className="py-3.5 px-4">Status Progres</th>
                    <th className="py-3.5 px-4">Tanggal Diperbarui</th>
                    <th className="py-3.5 px-4">Diunggah Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((row) => {
                    const isUnread = !readIds.includes(row.id);
                    return (
                      <tr
                        key={row.id}
                        onClick={() => handleRowClick(row.id)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                          isUnread ? 'bg-amber-50/70 font-black text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          {isUnread ? (
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"
                              title="Belum Dibuka"
                            />
                          ) : (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-slate-900 whitespace-nowrap">
                          {row.nomor}
                        </td>

                        <td className="py-3.5 px-4 max-w-md">
                          <p className={`line-clamp-2 leading-relaxed ${isUnread ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {row.judul}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-800 font-bold">
                          {row.kabupaten}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                            {row.jenis}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge status={row.status} />
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px] font-medium">
                          {row.updatedAt}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-bold">
                          {row.uploadedBy}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Tidak Ada Peraturan Ditemukan"
              description="Tidak ada data peraturan yang cocok dengan kata kunci pencarian atau filter yang Anda pilih."
              actionBtn={
                <button
                  onClick={handleResetAllFilters}
                  className="px-4 py-2 flat-btn-amber text-white text-xs font-bold"
                >
                  Reset Semua Filter
                </button>
              }
            />
          )}

          {/* Pagination Footer Flat 2.0 */}
          {filteredData.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 font-semibold">
              <div>
                Menampilkan <span className="font-black text-slate-900">{((currentPage - 1) * pageSize) + 1}</span> - <span className="font-black text-slate-900">{Math.min(currentPage * pageSize, filteredData.length)}</span> dari <span className="font-black text-slate-900">{filteredData.length}</span> total peraturan
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg flat-btn-secondary flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'flat-btn-amber text-white'
                        : 'flat-btn-secondary text-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-lg flat-btn-secondary flex items-center justify-center text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddPeraturanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={advancedFilters}
        onApplyFilters={(newF) => { setAdvancedFilters(newF); setCurrentPage(1); }}
        onResetFilters={handleResetAllFilters}
      />
    </AppLayout>
  );
};

export default PeraturanListPage;
