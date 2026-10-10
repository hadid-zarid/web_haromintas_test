import React, { useCallback, useEffect, useState } from 'react';
import { CircleCheck, CircleDashed, FilePlus2, Loader2, RefreshCw } from 'lucide-react';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { listGuidelines, reindexGuidelines, uploadGuidelines } from '../../lib/aiApi';
import { formatFileSize } from '../../lib/aiReport';

// Dokumen Pedoman (khusus Admin), tata letak sama dengan AI Document Checker: judul dan tombol di atas,
// tabel format / nama file / ukuran / status indexing di bawahnya.
const GuidelinesTab = ({ indexedChunks, onChanged }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [indexing, setIndexing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listGuidelines());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const res = await uploadGuidelines(files);
      showToast(`${res.total ?? files.length} file pedoman diunggah. Jangan lupa Re-index agar terbaca AI.`, 'success');
      await load();
    } catch (e) {
      showToast(`Gagal mengunggah pedoman: ${e.message}`, 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const onReindex = async () => {
    setIndexing(true);
    try {
      const res = await reindexGuidelines();
      showToast(res.message || 'Pedoman berhasil di-index ulang.', 'success');
      onChanged?.();
    } catch (e) {
      showToast(`Re-index gagal: ${e.message}`, 'error');
    } finally {
      setIndexing(false);
      setConfirmOpen(false);
    }
  };

  const indexed = (indexedChunks ?? 0) > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-[#2B3056]">Dokumen Pedoman (Reference Guidelines)</h2>
          <p className="text-sm text-slate-500">
            Kelola file pedoman (DOCX, PDF, TXT, MD, dll.) sebagai acuan aturan pemeriksaan kepatuhan, tanda baca, dan kosa kata.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <label className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 hover:border-[#2B3056]/40 text-sm font-semibold text-slate-800 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[#2B3056]/30">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus2 className="w-4 h-4 text-[#2B3056]" aria-hidden="true" />}
            Tambah Dokumen Pedoman
            <input type="file" multiple accept=".pdf,.docx,.doc,.txt,.md,.rtf,.odt" onChange={onUpload} disabled={uploading} className="sr-only" />
          </label>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 rounded-xl bg-[#2B3056] hover:bg-[#232849] text-white text-sm font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-[#FFD82B]" aria-hidden="true" /> Re-index Database Vektor
          </button>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Format</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">Nama File Dokumen</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Ukuran File</th>
                <th scope="col" className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Status Indexing</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">Memuat daftar pedoman...</td></tr>}
              {error && <tr><td colSpan={4} className="px-6 py-10 text-center text-red-600">{error}</td></tr>}
              {!loading && !error && items.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">Belum ada file pedoman.</td></tr>
              )}
              {items.map((g) => (
                <tr key={g.name} className="border-t border-slate-100">
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#E4E7F4] border border-[#D5D9EC] text-[11px] font-extrabold text-[#2B3056]">
                      {(g.extension || '').replace('.', '').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-800 break-words min-w-[14rem]">{g.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{formatFileSize(g.size)}</td>
                  <td className="px-5 py-3.5">
                    {indexed ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                        <CircleCheck className="w-3.5 h-3.5" aria-hidden="true" /> Terindeks
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-500">
                        <CircleDashed className="w-3.5 h-3.5" aria-hidden="true" /> Belum diindeks
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Modal isOpen={confirmOpen} onClose={() => !indexing && setConfirmOpen(false)} title="Re-index Database Vektor" size="sm">
        <p className="text-sm text-slate-600 leading-relaxed">
          Seluruh file pedoman akan diproses ulang ke database vektor. Proses ini bisa memakan waktu beberapa menit dan
          pemeriksaan dokumen yang sedang berjalan bisa terganggu.
        </p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            disabled={indexing}
            className="min-h-[44px] sm:min-h-[38px] px-4 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onReindex}
            disabled={indexing}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[38px] px-4 rounded-lg bg-[#2B3056] text-white text-xs font-bold hover:bg-[#232849] cursor-pointer disabled:opacity-60"
          >
            {indexing && <Loader2 className="w-4 h-4 animate-spin" />} Ya, Re-index
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default GuidelinesTab;
