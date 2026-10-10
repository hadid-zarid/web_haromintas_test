import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Code2, Eye, Loader2, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { AI_API_BASE_URL, getReport, listReports } from '../../lib/aiApi';
import { formatDateTime, gradeBadgeClass } from '../../lib/aiReport';

// Riwayat Laporan Pemeriksaan, tata letak sama dengan AI Document Checker: judul di atas, tabel
// dokumen / skor / grade / waktu cek / aksi di bawahnya. "Lihat Hasil" membuka laporan di tab
// Pemeriksaan dengan tampilan yang sama seperti hasil baru (bukan JSON mentah).
const HistoryTab = ({ onOpenReport }) => {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [openingId, setOpeningId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReports(await listReports());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? reports.filter((r) => (r.document_name || '').toLowerCase().includes(q)) : reports;
  }, [reports, query]);

  const open = async (id) => {
    setOpeningId(id);
    try {
      onOpenReport(await getReport(id));
    } catch (e) {
      showToast(`Gagal membuka laporan: ${e.message}`, 'error');
    } finally {
      setOpeningId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-[#2B3056]">Riwayat Laporan Pemeriksaan</h2>
          <p className="text-sm text-slate-500">
            Semua hasil pemeriksaan tersimpan di sini, termasuk kalau dokumen yang sama dicek berkali-kali (revisi demi revisi).
          </p>
        </div>
        <label className="relative block md:w-64 shrink-0">
          <span className="sr-only">Cari nama dokumen</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama dokumen..."
            className="w-full min-h-[44px] pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B3056]/20 focus:border-[#2B3056]"
          />
        </label>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Dokumen</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Skor</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Grade</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Waktu Cek</th>
                <th scope="col" className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Memuat riwayat...</td></tr>}
              {error && <tr><td colSpan={5} className="px-6 py-10 text-center text-red-600">{error}</td></tr>}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    {reports.length === 0 ? 'Belum ada riwayat laporan tersimpan.' : 'Tidak ada dokumen yang cocok.'}
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-5 py-3.5 font-bold text-slate-800 break-words min-w-[14rem]">{r.document_name}</td>
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">{r.score != null ? Number(r.score).toFixed(1) : '-'}</td>
                  <td className="px-5 py-3.5">
                    {r.grade ? (
                      <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-extrabold text-white ${gradeBadgeClass(r.grade)}`}>
                        {r.grade}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatDateTime(r.checked_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => open(r.id)}
                        disabled={openingId === r.id}
                        className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[36px] px-3.5 rounded-lg bg-[#2B3056] hover:bg-[#232849] text-white text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
                      >
                        {openingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" aria-hidden="true" />}
                        Lihat Hasil
                      </button>
                      <a
                        href={`${AI_API_BASE_URL}/api/reports/${encodeURIComponent(r.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Lihat data mentah (JSON)"
                        className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[36px] px-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-600"
                      >
                        <Code2 className="w-3.5 h-3.5" aria-hidden="true" /> JSON
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default HistoryTab;
