import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import Modal from '../common/Modal';

// Dimuat lazy dari ProfilPage, jadi react-easy-crop hanya diunduh saat user mengganti foto.

const UKURAN_HASIL = 512;

// Gambar area terpilih ke canvas persegi lalu jadikan JPEG. Server tetap meng-encode ulang
// (AvatarService), ini hanya agar unggahan kecil dan sudah terpotong sesuai pilihan user.
const potongKeJpeg = async (src, area) => {
  const gambar = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  const canvas = document.createElement('canvas');
  canvas.width = UKURAN_HASIL;
  canvas.height = UKURAN_HASIL;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, UKURAN_HASIL, UKURAN_HASIL);
  ctx.drawImage(gambar, area.x, area.y, area.width, area.height, 0, 0, UKURAN_HASIL, UKURAN_HASIL);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Gagal memproses foto.'))), 'image/jpeg', 0.9)
  );
};

export default function AvatarCropModal({ src, onClose, onSave, processing, error }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [gagal, setGagal] = useState('');

  const onCropComplete = useCallback((_, piksel) => setArea(piksel), []);

  const simpan = async () => {
    setGagal('');
    try {
      onSave(await potongKeJpeg(src, area));
    } catch {
      setGagal('Foto tidak dapat diproses. Coba pilih foto lain.');
    }
  };

  const pesan = error || gagal;

  return (
    <Modal isOpen onClose={processing ? () => {} : onClose} title="Atur foto profil">
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#1A1A5E]">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <ZoomOut className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
        <label htmlFor="zoom-foto" className="sr-only">Perbesar foto</label>
        <input
          id="zoom-foto"
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 min-h-[44px] accent-[#2B3056] cursor-pointer"
        />
        <ZoomIn className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
      </div>
      <p className="text-xs text-slate-500">Geser foto untuk mengatur posisi, gunakan slider untuk memperbesar.</p>

      {pesan && <p role="alert" className="mt-3 text-sm font-semibold text-rose-600">{pesan}</p>}

      <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="w-full sm:w-auto min-h-[44px] px-5 rounded-xl border border-[#E2E2DC] text-sm font-bold text-[#2B3056] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD82B]/70 disabled:opacity-50 cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={simpan}
          disabled={processing || !area}
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl bg-[#2B3056] text-white text-sm font-bold hover:bg-[#1A1A5E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD82B]/70 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {processing && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          Simpan foto
        </button>
      </div>
    </Modal>
  );
}
