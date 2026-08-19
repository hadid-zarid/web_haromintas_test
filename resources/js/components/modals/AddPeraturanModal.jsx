import React, { useState } from 'react';
import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import { KABUPATEN_LIST, JENIS_PERATURAN } from '../../mock/mockPeraturan';
import { useAuth } from '../../context/AuthContext';
import { usePeraturan } from '../../context/PeraturanContext';
import { useToast } from '../../context/ToastContext';
import { PlusCircle, FilePlus, Building, Scale, Layers } from 'lucide-react';

export const AddPeraturanModal = ({ isOpen, onClose }) => {
  const { user, role } = useAuth();
  const { addPeraturan } = usePeraturan();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    judul: '',
    kabupaten: KABUPATEN_LIST[0],
    jenis: JENIS_PERATURAN[0],
    proja: role && role.startsWith('Proja') ? role : 'Proja 1',
    nomor: '',
    keterangan: ''
  });

  const [initialFile, setInitialFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      showToast('Mohon isi Judul Peraturan terlebih dahulu.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addPeraturan({ ...formData, initialFile }, user?.name, role);
      showToast(`Peraturan baru "${formData.judul.slice(0, 30)}..." berhasil ditambahkan!`, 'success');
      setIsSubmitting(false);
      setFormData({
        judul: '',
        kabupaten: KABUPATEN_LIST[0],
        jenis: JENIS_PERATURAN[0],
        proja: role && role.startsWith('Proja') ? role : 'Proja 1',
        nomor: '',
        keterangan: ''
      });
      setInitialFile(null);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Peraturan Baru"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields grid */}
        <div>
          <label className="block text-xs font-black text-slate-800 mb-1.5">
            Judul Peraturan <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={2}
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            placeholder="Contoh: Rancangan Peraturan Daerah tentang Pengelolaan Keuangan Daerah..."
            className="w-full text-xs p-3 clay-input rounded-2xl outline-none font-bold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">Kabupaten / Kota</label>
            <select
              value={formData.kabupaten}
              onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
              className="w-full text-xs p-3 clay-input rounded-2xl outline-none font-bold"
            >
              {KABUPATEN_LIST.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">Jenis Peraturan</label>
            <select
              value={formData.jenis}
              onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
              className="w-full text-xs p-3 clay-input rounded-2xl outline-none font-bold"
            >
              {JENIS_PERATURAN.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 mb-1.5">Tim Proja Penanggung Jawab</label>
            <select
              value={formData.proja}
              onChange={(e) => setFormData({ ...formData, proja: e.target.value })}
              className="w-full text-xs p-3 clay-input rounded-2xl outline-none font-bold"
            >
              <option value="Proja 1">Proja 1</option>
              <option value="Proja 2">Proja 2</option>
              <option value="Proja 3">Proja 3</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-800 mb-1.5">Nomor Berkas / Agenda (Opsional)</label>
          <input
            type="text"
            value={formData.nomor}
            onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
            placeholder="Misal: 16/RAPERDA/2024 (Biarkan kosong untuk penomoran otomatis)"
            className="w-full text-xs p-3 clay-input rounded-2xl outline-none font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-800 mb-1.5">Lampirkan Draft Rancangan Awal (Opsional)</label>
          <FileUpload
            onFileSelected={(file) => setInitialFile(file)}
            allowedExtensions={['.pdf', '.doc', '.docx']}
          />
        </div>

        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold clay-btn-slate rounded-2xl"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2.5 text-xs font-black clay-btn-amber text-white rounded-2xl flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white drop-shadow" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Peraturan'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPeraturanModal;
