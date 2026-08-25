import React, { useState, useRef, useEffect } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";
import {
  Search,
  PlusCircle,
  RotateCcw,
  SlidersHorizontal,
  FileText,
  Building,
  CheckCircle2,
  AlertCircle,
  Calendar,
  UserCheck,
  Edit3,
  Trash2,
  Eye,
  X,
  Upload,
  Layers,
  AlertTriangle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  RefreshCw
} from "lucide-react";

export const PeraturanListPage = ({
  permohonans = { data: [] },
  stats = {},
  availableKabupatens = [],
  allKabupatens = [],
  jenisRegulasis = [],
  statuses = [],
  timKerjas = [],
  filters = {},
}) => {
  const { user, role, isTimKerja, isAdmin, isBiroHukum, isPimpinan } = useAuth();
  const { flash } = usePage().props;

  // Filter & Sorting States
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [selectedKabupaten, setSelectedKabupaten] = useState(filters.kabupaten_id || "ALL");
  const [selectedJenis, setSelectedJenis] = useState(filters.jenis_regulasi_id || "ALL");
  const [selectedStatus, setSelectedStatus] = useState(filters.status_id || "ALL");
  const [selectedTimKerja, setSelectedTimKerja] = useState(filters.tim_kerja_id || "ALL");
  const [sortBy, setSortBy] = useState(filters.sort_by || "created_at");
  const [sortDir, setSortDir] = useState(filters.sort_dir || "desc");
  const [perPage, setPerPage] = useState(filters.per_page || 10);

  // Modal & Action States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPermohonan, setEditingPermohonan] = useState(null);
  const [deletingPermohonan, setDeletingPermohonan] = useState(null);

  // Tracks previous search term to avoid redundant re-fetches & loops
  const prevSearchRef = useRef(filters.search || "");

  // Live search otomatis saat mengetik (debounced 300ms)
  useEffect(() => {
    if (prevSearchRef.current === searchTerm) {
      return;
    }

    const timer = setTimeout(() => {
      prevSearchRef.current = searchTerm;
      triggerQuery({ page: 1, search: searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Sync state when props change
  useEffect(() => {
    prevSearchRef.current = filters.search || "";
    setSearchTerm(filters.search || "");
    setSelectedKabupaten(filters.kabupaten_id || "ALL");
    setSelectedJenis(filters.jenis_regulasi_id || "ALL");
    setSelectedStatus(filters.status_id || "ALL");
    setSelectedTimKerja(filters.tim_kerja_id || "ALL");
    setSortBy(filters.sort_by || "created_at");
    setSortDir(filters.sort_dir || "desc");
    setPerPage(filters.per_page || 10);
  }, [filters]);

  const addFileInputRef = useRef(null);

  // Form: Tambah Permohonan
  const addForm = useForm({
    judul_rancangan: "",
    nomor_regulasi: "",
    jenis_regulasi_id: jenisRegulasis[0]?.jenis_regulasi_id || 1,
    kabupaten_id: availableKabupatens[0]?.kabupaten_id || 1,
    keterangan: "",
    initial_file: null,
  });

  // Form: Edit Permohonan
  const editForm = useForm({
    judul_rancangan: "",
    nomor_regulasi: "",
    jenis_regulasi_id: 1,
    kabupaten_id: 1,
    status_id: 1,
    keterangan: "",
  });

  // Centralized Navigation with Filters & Sorting
  const triggerQuery = (overrides = {}) => {
    const queryParams = {
      search: overrides.search !== undefined ? overrides.search : searchTerm,
      kabupaten_id: overrides.kabupaten_id !== undefined ? overrides.kabupaten_id : selectedKabupaten,
      jenis_regulasi_id: overrides.jenis_regulasi_id !== undefined ? overrides.jenis_regulasi_id : selectedJenis,
      status_id: overrides.status_id !== undefined ? overrides.status_id : selectedStatus,
      tim_kerja_id: overrides.tim_kerja_id !== undefined ? overrides.tim_kerja_id : selectedTimKerja,
      sort_by: overrides.sort_by !== undefined ? overrides.sort_by : sortBy,
      sort_dir: overrides.sort_dir !== undefined ? overrides.sort_dir : sortDir,
      per_page: overrides.per_page !== undefined ? overrides.per_page : perPage,
      page: overrides.page !== undefined ? overrides.page : 1,
    };

    // Bersihkan parameter default 'ALL' agar URL rapi
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] === "ALL" || queryParams[key] === "" || queryParams[key] === null) {
        delete queryParams[key];
      }
    });

    router.get("/peraturan", queryParams, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  // Handle Search & Filter Form Submit
  const handleFilterSubmit = (e) => {
    e?.preventDefault();
    triggerQuery({ page: 1 });
  };

  // Reset Filter
  const handleResetFilter = () => {
    setSearchTerm("");
    setSelectedKabupaten("ALL");
    setSelectedJenis("ALL");
    setSelectedStatus("ALL");
    setSelectedTimKerja("ALL");
    setSortBy("created_at");
    setSortDir("desc");
    setPerPage(10);
    router.get("/peraturan", {}, { preserveState: false });
  };

  // Handle Column Header Sort Click
  const handleSort = (columnKey) => {
    const newDir = sortBy === columnKey && sortDir === "asc" ? "desc" : "asc";
    setSortBy(columnKey);
    setSortDir(newDir);
    triggerQuery({
      sort_by: columnKey,
      sort_dir: newDir,
      page: 1,
    });
  };

  // Submit Add Permohonan
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addForm.post("/peraturan", {
      forceFormData: true,
      onSuccess: () => {
        setIsAddModalOpen(false);
        addForm.reset();
      },
    });
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingPermohonan(item);
    editForm.setData({
      judul_rancangan: item.judul_rancangan || "",
      nomor_regulasi: item.nomor_regulasi || "",
      jenis_regulasi_id: item.jenis_regulasi_id || 1,
      kabupaten_id: item.kabupaten_id || 1,
      status_id: item.status_id || 1,
      keterangan: item.keterangan || "",
    });
  };

  // Submit Edit Permohonan
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPermohonan) return;

    editForm.put(`/peraturan/${editingPermohonan.rancangan_id}`, {
      onSuccess: () => {
        setEditingPermohonan(null);
        editForm.reset();
      },
    });
  };

  // Submit Delete Permohonan
  const handleDeleteConfirm = () => {
    if (!deletingPermohonan) return;
    router.delete(`/peraturan/${deletingPermohonan.rancangan_id}`, {
      onSuccess: () => setDeletingPermohonan(null),
    });
  };

  // Format File Size Helper
  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const canAdd = isTimKerja || isAdmin;

  // Render Sortable Header Th Helper
  const renderSortableHeader = (label, columnKey, alignRight = false) => {
    const isActive = sortBy === columnKey;
    return (
      <th
        onClick={() => handleSort(columnKey)}
        className={`py-3.5 px-4 cursor-pointer select-none transition hover:bg-slate-100/80 group ${
          alignRight ? "text-right" : ""
        }`}
        title={`Urutkan berdasarkan ${label}`}
      >
        <div className={`inline-flex items-center gap-1.5 ${alignRight ? "justify-end" : ""}`}>
          <span className={isActive ? "text-[#1A1A5E] font-black" : "text-slate-600 font-extrabold"}>
            {label}
          </span>
          <span className="shrink-0">
            {isActive ? (
              sortDir === "asc" ? (
                <ArrowUp className="w-3.5 h-3.5 text-amber-500 font-black stroke-[2.5]" />
              ) : (
                <ArrowDown className="w-3.5 h-3.5 text-amber-500 font-black stroke-[2.5]" />
              )
            ) : (
              <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <AppLayout>
      <Head title="Daftar Permohonan Peraturan - HARMONITAS" />

      <div className="space-y-6">
        {/* Flash Notification */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>{flash.success}</p>
          </div>
        )}

        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-bold shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>{flash.error}</p>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A1A5E] tracking-tight">
              Permohonan Regulasi Daerah
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Pengelolaan & pemantauan alur berkas harmonisasi Ranperda / Ranperkada se-Provinsi Riau.
            </p>
          </div>

          {canAdd && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1A5E] hover:bg-[#2C3154] text-white text-xs font-black shadow-md shadow-[#1A1A5E]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-[#FFC800]" />
              <span>+ Tambah Permohonan Baru</span>
            </button>
          )}
        </div>

        {/* BENTO STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Berkas</p>
            <p className="text-2xl font-black text-[#1A1A5E] mt-1">{stats?.total || 0}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">Permohonan terdaftar</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Draf Awal</p>
            <p className="text-2xl font-black text-slate-700 mt-1">{stats?.draft || 0}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">Pra-harmonisasi / AI</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">Proses Harmonisasi</p>
            <p className="text-2xl font-black text-blue-700 mt-1">{stats?.harmonisasi || 0}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">Rapat Kanwil Riau</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-wider text-purple-600">Proses Fasilitasi</p>
            <p className="text-2xl font-black text-purple-700 mt-1">{stats?.fasilitasi || 0}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">Telaah Biro Hukum</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2E2DC] shadow-sm col-span-2 sm:col-span-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Selesai / Tuntas</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{stats?.selesai || 0}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">Fasilitasi terbit</p>
          </div>
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E2DC] shadow-sm">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nomor berkas atau judul peraturan..."
                className="w-full pl-10 pr-4 py-2 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
              />
            </div>

            {/* Filter Kabupaten */}
            <div className="sm:col-span-3">
              <select
                value={selectedKabupaten}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedKabupaten(val);
                  triggerQuery({ kabupaten_id: val, page: 1 });
                }}
                className="w-full py-2 px-3 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
              >
                <option value="ALL">
                  {isTimKerja 
                    ? `Semua Wilayah (${user?.tim_kerja?.nama_tim_kerja || 'Tim Kerja Anda'})` 
                    : 'Semua Kabupaten / Kota'}
                </option>
                {availableKabupatens.map((k) => (
                  <option key={k.kabupaten_id} value={k.kabupaten_id}>
                    {k.nama_kabupaten} {(!isTimKerja && k.tim_kerja?.nama_tim_kerja) ? `(${k.tim_kerja.nama_tim_kerja})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Jenis (Ranperda / Ranperkada) */}
            <div className="sm:col-span-2">
              <select
                value={selectedJenis}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedJenis(val);
                  triggerQuery({ jenis_regulasi_id: val, page: 1 });
                }}
                className="w-full py-2 px-3 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
              >
                <option value="ALL">Semua Jenis</option>
                {jenisRegulasis.map((j) => (
                  <option key={j.jenis_regulasi_id} value={j.jenis_regulasi_id}>
                    {j.nama_jenis}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="sm:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedStatus(val);
                  triggerQuery({ status_id: val, page: 1 });
                }}
                className="w-full py-2 px-3 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
              >
                <option value="ALL">Semua Status</option>
                {statuses.map((s) => (
                  <option key={s.status_id} value={s.status_id}>
                    {s.nama_status}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions Buttons */}
            <div className="sm:col-span-1 flex items-center gap-1.5">
              <button
                type="submit"
                className="flex-1 py-2 px-2.5 bg-[#1A1A5E] text-white hover:bg-[#2C3154] rounded-xl text-xs font-bold transition flex items-center justify-center shadow-xs"
                title="Terapkan Filter"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FFC800]" />
              </button>
              <button
                type="button"
                onClick={handleResetFilter}
                title="Reset Semua Filter"
                className="p-2 bg-[#F8F8F5] border border-[#E2E2DC] hover:bg-white text-slate-600 rounded-xl transition shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* PERATURAN TABLE */}
        <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-[#1A1A5E]">
                Daftar Permohonan Regulasi ({permohonans?.total || permohonans?.data?.length || 0})
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Klik judul atau header tabel untuk mengurutkan data (Sort). Klik baris untuk melihat detail & 7 slot dokumen.
              </p>
            </div>

            {/* Per Page Selector */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>Tampilkan:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPerPage(val);
                  triggerQuery({ per_page: val, page: 1 });
                }}
                className="py-1 px-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-lg text-xs font-bold text-[#1A1A5E] focus:outline-none focus:ring-1 focus:ring-[#FFC800]"
              >
                <option value={5}>5 baris</option>
                <option value={10}>10 baris</option>
                <option value={25}>25 baris</option>
                <option value={50}>50 baris</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F8F5] border-b border-[#E2E2DC] text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {renderSortableHeader("Nomor Berkas", "nomor_regulasi")}
                  {renderSortableHeader("Judul Peraturan & Wilayah", "judul_rancangan")}
                  {renderSortableHeader("Jenis", "jenis_regulasi_id")}
                  {renderSortableHeader("Status Progres", "status_id")}
                  {renderSortableHeader("Tanggal Masuk", "tanggal_dibuat")}
                  <th className="py-3.5 px-4">Petugas / Dokumen</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {permohonans?.data && permohonans.data.length > 0 ? (
                  permohonans.data.map((item) => {
                    const docCount = item.dokumens?.length || 0;
                    const jenisName = item.jenis_regulasi?.nama_jenis || (item.jenis_regulasi_id === 1 ? "Ranperda" : "Ranperkada");
                    const kabName = item.kabupaten?.nama_kabupaten || "Wilayah Riau";
                    const timName = item.tim_kerja?.nama_tim_kerja || item.kabupaten?.tim_kerja?.nama_tim_kerja || "Tim Kerja";

                    return (
                      <tr
                        key={item.rancangan_id}
                        className="hover:bg-slate-50/70 transition cursor-pointer"
                        onClick={() => router.visit(`/peraturan/${item.rancangan_id}`)}
                      >
                        {/* Nomor Berkas */}
                        <td className="py-3.5 px-4 font-black text-[#1A1A5E] whitespace-nowrap">
                          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-mono">
                            {item.nomor_regulasi}
                          </span>
                        </td>

                        {/* Judul & Wilayah */}
                        <td className="py-3.5 px-4 max-w-md">
                          <p className="font-black text-[#1A1A5E] leading-snug line-clamp-2">
                            {item.judul_rancangan}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-bold">
                            <span className="flex items-center gap-1 text-slate-700 font-bold">
                              <Building className="w-3 h-3 text-[#FFC800] shrink-0" />
                              <span>{kabName}</span>
                            </span>
                            {!isTimKerja && (
                              <>
                                <span>•</span>
                                <span className="text-blue-700 font-semibold">{timName}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Jenis */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${
                            jenisName === "Ranperda"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-teal-50 text-teal-700 border-teal-200"
                          }`}>
                            {jenisName}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge statusId={item.status_id} />
                        </td>

                        {/* Tanggal */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-semibold">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>
                              {item.tanggal_dibuat
                                ? new Date(item.tanggal_dibuat).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                                : "-"}
                            </span>
                          </div>
                        </td>

                        {/* Petugas / Dokumen */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-slate-400" />
                            <span>{item.uploader?.nama || "Petugas Kanwil"}</span>
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {docCount > 0 ? `📁 ${docCount}/7 Dokumen Lengkap` : "Belum ada dokumen"}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => router.visit(`/peraturan/${item.rancangan_id}`)}
                              title="Buka Lembar Detail Berkas"
                              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition shadow-xs"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {(isTimKerja || isAdmin) && (
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                title="Edit Data Berkas"
                                className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition shadow-xs"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}

                            {(isAdmin || isTimKerja) && (
                              <button
                                type="button"
                                onClick={() => setDeletingPermohonan(item)}
                                title="Hapus Berkas Permohonan"
                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition shadow-xs"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      <EmptyState
                        title="Tidak Ada Permohonan Ditemukan"
                        description="Belum ada berkas rancangan peraturan yang sesuai dengan kata kunci atau filter yang Anda pilih."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* COMPREHENSIVE PAGINATION SECTION (ALWAYS VISIBLE) */}
          <div className="p-4 border-t border-[#E2E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAFBFD]">
            <div className="text-[11px] font-bold text-slate-500">
              {permohonans?.total > 0 ? (
                <>
                  Menampilkan <strong>{permohonans.from || 1}</strong> – <strong>{permohonans.to || permohonans.total}</strong> dari total <strong>{permohonans.total}</strong> permohonan
                  {permohonans.last_page > 1 && ` (Halaman ${permohonans.current_page} dari ${permohonans.last_page})`}
                </>
              ) : (
                "Tidak ada data untuk ditampilkan"
              )}
            </div>

            {/* Pagination Button List */}
            {permohonans?.links && (
              <div className="flex items-center gap-1">
                {permohonans.links.map((link, idx) => {
                  const isPrevious = link.label.includes("Previous") || link.label.includes("&laquo;");
                  const isNext = link.label.includes("Next") || link.label.includes("&raquo;");

                  let displayLabel = link.label;
                  if (isPrevious) displayLabel = "‹";
                  if (isNext) displayLabel = "›";

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!link.url || link.active}
                      onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                      className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        link.active
                          ? "bg-[#1A1A5E] text-white shadow-xs"
                          : link.url
                          ? "bg-white text-slate-700 hover:bg-slate-100 border border-[#E2E2DC] shadow-xs"
                          : "opacity-40 text-slate-400 bg-slate-100 cursor-not-allowed border border-slate-200"
                      }`}
                      dangerouslySetInnerHTML={{ __html: displayLabel }}
                      title={link.url ? `Pindah ke Halaman ${link.label.replace(/&[a-z]+;/g, '')}` : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: TAMBAH PERMOHONAN BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="bg-[#2C3154] text-white p-5 flex items-center justify-between border-b border-[#383F6A]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFC800]/20 border border-[#FFC800]/30 flex items-center justify-center text-[#FFC800]">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Tambah Permohonan Regulasi Baru</h3>
                  <p className="text-[10px] text-[#FFC800] font-bold">
                    Pendaftaran Draf Ranperda / Ranperkada ke Sistem HARMONITAS
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Judul Rancangan */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Judul Rancangan Peraturan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={addForm.data.judul_rancangan}
                  onChange={(e) => addForm.setData("judul_rancangan", e.target.value)}
                  placeholder="Contoh: Rancangan Peraturan Daerah tentang Pajak Daerah dan Retribusi Daerah..."
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                />
                {addForm.errors.judul_rancangan && (
                  <p className="mt-1 text-[10px] text-rose-600 font-bold">{addForm.errors.judul_rancangan}</p>
                )}
              </div>

              {/* Nomor Berkas / Registrasi */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Nomor Registrasi / Berkas (Opsional - Otomatis dibuat jika kosong)
                </label>
                <input
                  type="text"
                  value={addForm.data.nomor_regulasi}
                  onChange={(e) => addForm.setData("nomor_regulasi", e.target.value)}
                  placeholder="Contoh: 09/RANPERDA/2026"
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                />
              </div>

              {/* Jenis Regulasi & Kabupaten */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Jenis Regulasi <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.data.jenis_regulasi_id}
                    onChange={(e) => addForm.setData("jenis_regulasi_id", Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  >
                    {jenisRegulasis.map((j) => (
                      <option key={j.jenis_regulasi_id} value={j.jenis_regulasi_id}>
                        {j.nama_jenis}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Pemerintah Daerah / Wilayah <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.data.kabupaten_id}
                    onChange={(e) => addForm.setData("kabupaten_id", Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                  >
                    {availableKabupatens.map((k) => (
                      <option key={k.kabupaten_id} value={k.kabupaten_id}>
                        {k.nama_kabupaten} {k.tim_kerja?.nama_tim_kerja ? `(${k.tim_kerja.nama_tim_kerja})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Upload Draf Awal (Slot 1) */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Lampiran Draf Awal Peraturan (Slot #1 - Opsional)
                </label>

                {!addForm.data.initial_file ? (
                  <div
                    onClick={() => addFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#1A1A5E] hover:bg-slate-50/60 rounded-2xl p-4 bg-[#F8F8F5] text-center transition cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={addFileInputRef}
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => addForm.setData("initial_file", e.target.files[0])}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-[#1A1A5E] mx-auto mb-1.5 group-hover:scale-105 transition" />
                    <p className="text-xs font-black text-[#1A1A5E]">
                      Pilih file Draf Awal (.PDF, .DOC, .DOCX)
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Maks. 25MB</p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                          Berkas Terlampir
                        </span>
                        <p className="text-xs font-black text-[#1A1A5E] truncate mt-0.5" title={addForm.data.initial_file.name}>
                          {addForm.data.initial_file.name}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold">
                          {formatFileSize(addForm.data.initial_file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addForm.setData("initial_file", null)}
                      className="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 transition"
                      title="Hapus Berkas"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Keterangan Tambahan */}
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Catatan / Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={addForm.data.keterangan}
                  onChange={(e) => addForm.setData("keterangan", e.target.value)}
                  placeholder="Catatan pengajuan berkas..."
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addForm.processing}
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A5E] hover:bg-[#2C3154] text-white text-xs font-black transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>{addForm.processing ? "Menyimpan..." : "Daftarkan Permohonan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DATA PERMOHONAN */}
      {editingPermohonan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#2C3154] text-white p-5 flex items-center justify-between border-b border-[#383F6A]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#FFC800]" />
                <h3 className="text-sm font-black text-white">Edit Data Permohonan</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPermohonan(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Nomor Registrasi
                </label>
                <input
                  type="text"
                  value={editForm.data.nomor_regulasi}
                  onChange={(e) => editForm.setData("nomor_regulasi", e.target.value)}
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                  Judul Rancangan Peraturan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={editForm.data.judul_rancangan}
                  onChange={(e) => editForm.setData("judul_rancangan", e.target.value)}
                  className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFC800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Jenis Regulasi
                  </label>
                  <select
                    value={editForm.data.jenis_regulasi_id}
                    onChange={(e) => editForm.setData("jenis_regulasi_id", Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none"
                  >
                    {jenisRegulasis.map((j) => (
                      <option key={j.jenis_regulasi_id} value={j.jenis_regulasi_id}>
                        {j.nama_jenis}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1A1A5E] mb-1">
                    Pemerintah Daerah
                  </label>
                  <select
                    value={editForm.data.kabupaten_id}
                    onChange={(e) => editForm.setData("kabupaten_id", Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F8F8F5] border border-[#E2E2DC] rounded-xl text-xs font-bold text-[#1A1A5E] focus:bg-white focus:outline-none"
                  >
                    {availableKabupatens.map((k) => (
                      <option key={k.kabupaten_id} value={k.kabupaten_id}>
                        {k.nama_kabupaten}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPermohonan(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editForm.processing}
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A5E] hover:bg-[#2C3154] text-white text-xs font-black transition flex items-center gap-1.5 shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC800]" />
                  <span>{editForm.processing ? "Menyimpan..." : "Perbarui Data"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI HAPUS */}
      {deletingPermohonan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A5E]/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E2DC] shadow-2xl max-w-md w-full overflow-hidden p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1A1A5E]">Hapus Permohonan Regulasi?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Apakah Anda yakin ingin menghapus berkas <strong>{deletingPermohonan.nomor_regulasi}</strong>? Seluruh file dan riwayat dokumen yang terkait akan dihapus secara permanen.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingPermohonan(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E2E2DC] text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition shadow-md"
              >
                Ya, Hapus Berkas
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default PeraturanListPage;