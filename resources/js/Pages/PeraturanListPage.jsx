import React, { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import { useAuth } from "../context/AuthContext";
import { usePeraturan } from "../context/PeraturanContext";
import AppLayout from "../components/layout/AppLayout";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";
import AddPeraturanModal from "../components/modals/AddPeraturanModal";
import AdvancedFilterModal from "../components/modals/AdvancedFilterModal";
import {
  Search,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  KABUPATEN_LIST,
  JENIS_PERATURAN,
  STATUS_PERATURAN,
} from "../mock/mockPeraturan";

export const PeraturanListPage = () => {
  const { role: currentRole } = useAuth();
  const { peraturanList, readIds, markAsRead } = usePeraturan();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState({
    kabupaten: "",
    status: "",
    jenis: "",
    proja: "",
    startDate: "",
    endDate: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter Data Logic per Role + Search + Filters
  const filteredData = useMemo(() => {
    return peraturanList.filter((item) => {
      if (["Proja 1", "Proja 2", "Proja 3"].includes(currentRole)) {
        if (item.proja !== currentRole) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesJudul = item.judul.toLowerCase().includes(q);
        const matchesNomor = item.nomor.toLowerCase().includes(q);
        if (!matchesJudul && !matchesNomor) return false;
      }

      if (selectedKabupaten && item.kabupaten !== selectedKabupaten)
        return false;
      if (selectedStatus && item.status !== selectedStatus) return false;
      if (selectedJenis && item.jenis !== selectedJenis) return false;

      if (
        advancedFilters.kabupaten &&
        item.kabupaten !== advancedFilters.kabupaten
      )
        return false;
      if (advancedFilters.status && item.status !== advancedFilters.status)
        return false;
      if (advancedFilters.jenis && item.jenis !== advancedFilters.jenis)
        return false;
      if (advancedFilters.proja && item.proja !== advancedFilters.proja)
        return false;

      return true;
    });
  }, [
    peraturanList,
    currentRole,
    searchQuery,
    selectedKabupaten,
    selectedStatus,
    selectedJenis,
    advancedFilters,
  ]);

  // Paginated Data
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const canAddPeraturan = ["Proja 1", "Proja 2", "Proja 3"].includes(
    currentRole,
  );

  const activeFilterCount = [
    searchQuery,
    selectedKabupaten,
    selectedStatus,
    selectedJenis,
    ...Object.values(advancedFilters),
  ].filter(Boolean).length;

  const handleRowClick = (id) => {
    markAsRead(id);
    router.visit(`/peraturan/${id}`);
  };

  const handleResetAllFilters = () => {
    setSearchQuery("");
    setSelectedKabupaten("");
    setSelectedStatus("");
    setSelectedJenis("");
    setAdvancedFilters({
      kabupaten: "",
      status: "",
      jenis: "",
      proja: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Search & Filter Controls */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          {/* Primary Actions */}
          <div className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari berdasarkan judul atau nomor peraturan..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#1A1A5E]/40 focus:bg-white focus:ring-4 focus:ring-[#1A1A5E]/5"
              />
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-[#1A1A5E] transition-all hover:border-[#1A1A5E]/20 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#1A1A5E]/5"
                title="Filter Lanjutan"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100">
                  <SlidersHorizontal className="h-4 w-4" />
                </span>
                <span>Filter Lanjutan</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FFC800] px-1.5 text-[10px] font-black text-[#1A1A5E]">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Add Regulation */}
              {canAddPeraturan && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#1A1A5E] px-5 text-xs font-black text-white shadow-[0_8px_20px_rgba(26,26,94,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#25256f] hover:shadow-[0_12px_24px_rgba(26,26,94,0.22)] focus:outline-none focus:ring-4 focus:ring-[#1A1A5E]/15"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
                    <PlusCircle className="h-4 w-4" />
                  </span>
                  <span>Tambah Peraturan</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3.5 sm:px-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex shrink-0 items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#1A1A5E] shadow-sm ring-1 ring-slate-200">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#1A1A5E]">
                    Filter Cepat
                  </p>
                  <p className="text-[9px] font-semibold text-slate-500">
                    Saring daftar sesuai kebutuhan
                  </p>
                </div>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:max-w-4xl">
                <select
                  value={selectedKabupaten}
                  onChange={(e) => {
                    setSelectedKabupaten(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-[#1A1A5E]/40 focus:ring-4 focus:ring-[#1A1A5E]/5"
                >
                  <option value="">Semua Kabupaten/Kota</option>
                  {KABUPATEN_LIST.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-[#1A1A5E]/40 focus:ring-4 focus:ring-[#1A1A5E]/5"
                >
                  <option value="">Semua Status</option>
                  {Object.values(STATUS_PERATURAN).map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedJenis}
                  onChange={(e) => {
                    setSelectedJenis(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-[#1A1A5E]/40 focus:ring-4 focus:ring-[#1A1A5E]/5"
                >
                  <option value="">Semua Jenis</option>
                  {JENIS_PERATURAN.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>

                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-black text-red-600 transition-all hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Filter</span>
                  </button>
                ) : (
                  <div className="hidden h-11 items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-[10px] font-bold text-slate-400 lg:flex">
                    Belum ada filter aktif
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Datatable Container */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-black text-[#1A1A5E]">
                Daftar Permohonan Peraturan
              </h3>
              <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
                Klik salah satu baris untuk melihat detail permohonan
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-[#1A1A5E]/10 bg-[#1A1A5E]/5 px-3 py-1.5 text-[10px] font-black text-[#1A1A5E]">
              {filteredData.length} Peraturan
            </span>
          </div>

          {paginatedData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">
                      Status Baca
                    </th>
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
                          isUnread
                            ? "bg-amber-50/70 font-black text-slate-900"
                            : "text-slate-700"
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
                          <p
                            className={`line-clamp-2 leading-relaxed ${isUnread ? "font-black text-slate-900" : "font-semibold text-slate-700"}`}
                          >
                            {row.judul}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-800 font-bold">
                          {row.kabupaten}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-800">
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
                  className="rounded-xl bg-[#1A1A5E] px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#25256f]"
                >
                  Reset Semua Filter
                </button>
              }
            />
          )}

          {/* Pagination Footer Flat 2.0 */}
          {filteredData.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div>
                Menampilkan{" "}
                <span className="font-black text-slate-900">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                -{" "}
                <span className="font-black text-slate-900">
                  {Math.min(currentPage * pageSize, filteredData.length)}
                </span>{" "}
                dari{" "}
                <span className="font-black text-slate-900">
                  {filteredData.length}
                </span>{" "}
                total peraturan
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 min-w-9 rounded-xl px-2 text-xs font-black transition-all ${
                        currentPage === page
                          ? "bg-[#1A1A5E] text-white shadow-md"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                      aria-label={`Halaman ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
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
        onApplyFilters={(newF) => {
          setAdvancedFilters(newF);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetAllFilters}
      />
    </AppLayout>
  );
};

export default PeraturanListPage;