export const KABUPATEN_LIST = [
  'Kota Pekanbaru',
  'Kota Dumai',
  'Kab. Kampar',
  'Kab. Bengkalis',
  'Kab. Siak',
  'Kab. Pelalawan',
  'Kab. Rokan Hilir',
  'Kab. Rokan Hulu',
  'Kab. Indragiri Hilir',
  'Kab. Indragiri Hulu',
  'Kab. Kuantan Singingi',
  'Kab. Kepulauan Meranti'
];

export const JENIS_PERATURAN = [
  'Raperda',
  'Raperbup',
  'Raperwal'
];

export const STATUS_PERATURAN = {
  DRAFT: 'draft',
  PROSES: 'proses',
  HARMONISASI: 'harmonisasi',
  FASILITASI: 'fasilitasi',
  SELESAI: 'selesai'
};

export const DOCUMENT_TYPES = [
  { typeIndex: 1, title: 'Draft Rancangan', requiredBy: ['Proja 1', 'Proja 2', 'Proja 3'] },
  { typeIndex: 2, title: 'Analisa Konsepsi', requiredBy: ['Proja 1', 'Proja 2', 'Proja 3'] },
  { typeIndex: 3, title: 'Matrix Perubahan', requiredBy: ['Proja 1', 'Proja 2', 'Proja 3'] },
  { typeIndex: 4, title: 'Draft Hasil', requiredBy: ['Proja 1', 'Proja 2', 'Proja 3'] },
  { typeIndex: 5, title: 'Surat Hasil Harmonisasi', requiredBy: ['Proja 1', 'Proja 2', 'Proja 3'] },
  { typeIndex: 6, title: 'Surat Hasil Fasilitasi', requiredBy: ['Biro Hukum'] }
];

export const INITIAL_PERATURAN = [
  {
    id: 'REG-2024-001',
    nomor: '01/RAPERWAL/2024',
    judul: 'Rancangan Peraturan Wali Kota tentang Pajak Daerah dan Retribusi Daerah Kota Pekanbaru',
    kabupaten: 'Kota Pekanbaru',
    jenis: 'Raperwal',
    proja: 'Proja 1',
    status: STATUS_PERATURAN.SELESAI,
    updatedAt: '2024-08-01 14:30',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Fasilitasi selesai oleh Biro Hukum Provinsi Riau.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Raperwal_Pajak_Pekanbaru_v1.pdf', fileSize: '2.4 MB', uploadedAt: '2024-07-10 09:00', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Konsepsi_Pajak_Pekanbaru.pdf', fileSize: '1.8 MB', uploadedAt: '2024-07-12 11:15', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 3, title: 'Matrix Perubahan', fileName: 'Matrix_Perubahan_Pajak_Pekanbaru.docx', fileSize: '850 KB', uploadedAt: '2024-07-14 14:20', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 4, title: 'Draft Hasil', fileName: 'Draft_Hasil_Harmonisasi_Pajak.pdf', fileSize: '2.6 MB', uploadedAt: '2024-07-20 16:45', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 5, title: 'Surat Hasil Harmonisasi', fileName: 'Surat_Hasil_Harmonisasi_KanwilRiau_01.pdf', fileSize: '1.2 MB', uploadedAt: '2024-07-25 10:30', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 6, title: 'Surat Hasil Fasilitasi', fileName: 'Surat_Fasilitasi_BiroHukumRiau_Pekanbaru.pdf', fileSize: '1.5 MB', uploadedAt: '2024-08-01 14:30', uploadedBy: 'Fanny Nuraini, S.H.', fileUrl: '#' }
    ]
  },
  {
    id: 'REG-2024-002',
    nomor: '02/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Tata Ruang dan Perlindungan Kawasan Magrove Kampar',
    kabupaten: 'Kab. Kampar',
    jenis: 'Raperbup',
    proja: 'Proja 1',
    status: STATUS_PERATURAN.FASILITASI,
    updatedAt: '2024-08-03 11:20',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Dokumen fasilitasi sedang diproses di Biro Hukum Provinsi Riau.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Raperbup_TataRuang_Kampar.pdf', fileSize: '4.1 MB', uploadedAt: '2024-07-15 08:30', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Konsepsi_Kampar.pdf', fileSize: '2.1 MB', uploadedAt: '2024-07-18 10:00', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 3, title: 'Matrix Perubahan', fileName: 'Matrix_Sandingan_Kampar.pdf', fileSize: '1.1 MB', uploadedAt: '2024-07-20 13:10', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 4, title: 'Draft Hasil', fileName: 'Draft_Hasil_Kampar.pdf', fileSize: '4.3 MB', uploadedAt: '2024-07-28 15:00', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 5, title: 'Surat Hasil Harmonisasi', fileName: 'Surat_Harmonisasi_Kampar_02.pdf', fileSize: '1.4 MB', uploadedAt: '2024-08-02 09:15', uploadedBy: 'Proja 1', fileUrl: '#' },
      null
    ]
  },
  {
    id: 'REG-2024-003',
    nomor: '03/RAPERWAL/2024',
    judul: 'Rancangan Peraturan Wali Kota tentang Pengelolaan Kawasan Pelabuhan Dumai',
    kabupaten: 'Kota Dumai',
    jenis: 'Raperwal',
    proja: 'Proja 2',
    status: STATUS_PERATURAN.HARMONISASI,
    updatedAt: '2024-08-04 15:45',
    uploadedBy: 'Budi Santoso, M.H.',
    keterangan: 'Tahap penyusunan draft hasil dan perbaikan materi substansi.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Raperwal_Pelabuhan_Dumai.pdf', fileSize: '1.9 MB', uploadedAt: '2024-07-22 10:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Konsepsi_Pelabuhan.pdf', fileSize: '1.2 MB', uploadedAt: '2024-07-25 14:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 3, title: 'Matrix Perubahan', fileName: 'Matrix_Pasal_Pelabuhan.docx', fileSize: '620 KB', uploadedAt: '2024-08-01 11:30', uploadedBy: 'Proja 2', fileUrl: '#' },
      null, null, null
    ]
  },
  {
    id: 'REG-2024-004',
    nomor: '04/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Retribusi Pelayanan Pasar Rakyat Bengkalis',
    kabupaten: 'Kab. Bengkalis',
    jenis: 'Raperbup',
    proja: 'Proja 2',
    status: STATUS_PERATURAN.SELESAI,
    updatedAt: '2024-07-30 16:10',
    uploadedBy: 'Budi Santoso, M.H.',
    keterangan: 'Fasilitasi selesai.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Retribusi_Pasar_Bengkalis.pdf', fileSize: '3.0 MB', uploadedAt: '2024-06-10 09:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Retribusi_Bengkalis.pdf', fileSize: '1.5 MB', uploadedAt: '2024-06-15 11:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 3, title: 'Matrix Perubahan', fileName: 'Matrix_Retribusi_Bengkalis.docx', fileSize: '700 KB', uploadedAt: '2024-06-20 14:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 4, title: 'Draft Hasil', fileName: 'Draft_Hasil_Retribusi_Bengkalis.pdf', fileSize: '3.1 MB', uploadedAt: '2024-07-05 16:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 5, title: 'Surat Hasil Harmonisasi', fileName: 'Surat_Harmonisasi_Bengkalis.pdf', fileSize: '1.1 MB', uploadedAt: '2024-07-15 10:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 6, title: 'Surat Hasil Fasilitasi', fileName: 'Surat_Fasilitasi_Bengkalis_BiroHukumRiau.pdf', fileSize: '1.3 MB', uploadedAt: '2024-07-30 16:10', uploadedBy: 'Fanny Nuraini, S.H.', fileUrl: '#' }
    ]
  },
  {
    id: 'REG-2024-005',
    nomor: '05/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Pelestarian Budaya Melayu Siak Sri Indrapura',
    kabupaten: 'Kab. Siak',
    jenis: 'Raperbup',
    proja: 'Proja 1',
    status: STATUS_PERATURAN.PROSES,
    updatedAt: '2024-08-05 09:30',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Pemeriksaan awal berkas administrasi dan pemetaan fraksi.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Raperbup_BudayaMelayu_Siak.pdf', fileSize: '2.2 MB', uploadedAt: '2024-08-01 10:00', uploadedBy: 'Proja 1', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Konsepsi_Budaya_Siak.pdf', fileSize: '1.1 MB', uploadedAt: '2024-08-04 14:20', uploadedBy: 'Proja 1', fileUrl: '#' },
      null, null, null, null
    ]
  },
  {
    id: 'REG-2024-006',
    nomor: '06/RAPERDA/2024',
    judul: 'Rancangan Peraturan Daerah tentang Perlindungan Tenaga Kerja Sektor Perkebunan Kelapa Sawit',
    kabupaten: 'Kab. Pelalawan',
    jenis: 'Raperda',
    proja: 'Proja 1',
    status: STATUS_PERATURAN.DRAFT,
    updatedAt: '2024-08-06 08:15',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Input awal draft oleh pemohon.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Naskah_Sawit_Pelalawan.pdf', fileSize: '3.5 MB', uploadedAt: '2024-08-06 08:15', uploadedBy: 'Proja 1', fileUrl: '#' },
      null, null, null, null, null
    ]
  },
  {
    id: 'REG-2024-007',
    nomor: '07/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Pemberdayaan Usaha Mikro Sektor Kerajinan Kelapa',
    kabupaten: 'Kab. Indragiri Hilir',
    jenis: 'Raperbup',
    proja: 'Proja 3',
    status: STATUS_PERATURAN.FASILITASI,
    updatedAt: '2024-08-04 13:10',
    uploadedBy: 'Citra Dewi, S.H., M.Kn.',
    keterangan: 'Surat Fasilitasi sedang disiapkan oleh Biro Hukum Provinsi Riau.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_UMKM_Inhil.pdf', fileSize: '2.8 MB', uploadedAt: '2024-07-01 09:00', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_UMKM_Inhil.pdf', fileSize: '1.4 MB', uploadedAt: '2024-07-05 11:30', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 3, title: 'Matrix Perubahan', fileName: 'Matrix_UMKM_Inhil.docx', fileSize: '510 KB', uploadedAt: '2024-07-10 15:00', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 4, title: 'Draft Hasil', fileName: 'Draft_Hasil_UMKM_Inhil.pdf', fileSize: '2.9 MB', uploadedAt: '2024-07-20 10:20', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 5, title: 'Surat Hasil Harmonisasi', fileName: 'Surat_Harmonisasi_Inhil_UMKM.pdf', fileSize: '1.3 MB', uploadedAt: '2024-08-01 16:40', uploadedBy: 'Proja 3', fileUrl: '#' },
      null
    ]
  },
  {
    id: 'REG-2024-008',
    nomor: '08/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Penerapan SPBE dan Satu Data Kabupaten Rokan Hilir',
    kabupaten: 'Kab. Rokan Hilir',
    jenis: 'Raperbup',
    proja: 'Proja 2',
    status: STATUS_PERATURAN.HARMONISASI,
    updatedAt: '2024-08-02 11:00',
    uploadedBy: 'Budi Santoso, M.H.',
    keterangan: 'Rapat pleno harmonisasi dengan Dinas Kominfo Rokan Hilir.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_SPBE_Rohil.pdf', fileSize: '3.8 MB', uploadedAt: '2024-07-12 09:30', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Konsepsi_SPBE_Rohil.pdf', fileSize: '2.0 MB', uploadedAt: '2024-07-16 13:40', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 3, title: 'Matrix Perubahan', fileName: 'Matrix_Pasal_SPBE_Rohil.docx', fileSize: '920 KB', uploadedAt: '2024-07-25 16:15', uploadedBy: 'Proja 2', fileUrl: '#' },
      null, null, null
    ]
  },
  {
    id: 'REG-2024-009',
    nomor: '09/RAPERDA/2024',
    judul: 'Rancangan Peraturan Daerah tentang Pengelolaan Sumber Daya Air Danau Kuantan',
    kabupaten: 'Kab. Kuantan Singingi',
    jenis: 'Raperda',
    proja: 'Proja 3',
    status: STATUS_PERATURAN.PROSES,
    updatedAt: '2024-08-05 14:00',
    uploadedBy: 'Citra Dewi, S.H., M.Kn.',
    keterangan: 'Menunggu kelengkapan dokumen pendukung dari Bagian Hukum Kuansing.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Raperda_Danau_Kuansing.pdf', fileSize: '4.5 MB', uploadedAt: '2024-08-02 10:00', uploadedBy: 'Proja 3', fileUrl: '#' },
      null, null, null, null, null
    ]
  },
  {
    id: 'REG-2024-010',
    nomor: '10/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Pedoman APBDesa Kabupaten Rokan Hulu',
    kabupaten: 'Kab. Rokan Hulu',
    jenis: 'Raperbup',
    proja: 'Proja 2',
    status: STATUS_PERATURAN.HARMONISASI,
    updatedAt: '2024-08-03 16:30',
    uploadedBy: 'Budi Santoso, M.H.',
    keterangan: 'Pemeriksaan draft sandingan bersama tim asistensi desa Rohul.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_APBDesa_Rohul.pdf', fileSize: '2.7 MB', uploadedAt: '2024-07-20 09:00', uploadedBy: 'Proja 2', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Konsepsi_APBDesa_Rohul.pdf', fileSize: '1.3 MB', uploadedAt: '2024-07-24 11:20', uploadedBy: 'Proja 2', fileUrl: '#' },
      null, null, null, null
    ]
  },
  {
    id: 'REG-2024-011',
    nomor: '11/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Tata Cara Pemberian Beasiswa Anak Nelayan Meranti',
    kabupaten: 'Kab. Kepulauan Meranti',
    jenis: 'Raperbup',
    proja: 'Proja 3',
    status: STATUS_PERATURAN.SELESAI,
    updatedAt: '2024-07-28 10:15',
    uploadedBy: 'Citra Dewi, S.H., M.Kn.',
    keterangan: 'Fasilitasi selesai.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Beasiswa_Meranti.pdf', fileSize: '1.7 MB', uploadedAt: '2024-06-05 08:30', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 2, title: 'Analisa Konsepsi', fileName: 'Analisa_Beasiswa_Meranti.pdf', fileSize: '980 KB', uploadedAt: '2024-06-10 10:00', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 3, title: 'Matrix Perubahan', fileName: 'Matrix_Beasiswa_Meranti.docx', fileSize: '450 KB', uploadedAt: '2024-06-18 14:00', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 4, title: 'Draft Hasil', fileName: 'Draft_Hasil_Beasiswa_Meranti.pdf', fileSize: '1.8 MB', uploadedAt: '2024-07-02 11:00', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 5, title: 'Surat Hasil Harmonisasi', fileName: 'Surat_Harmonisasi_Beasiswa_Meranti.pdf', fileSize: '1.0 MB', uploadedAt: '2024-07-12 15:30', uploadedBy: 'Proja 3', fileUrl: '#' },
      { typeIndex: 6, title: 'Surat Hasil Fasilitasi', fileName: 'Surat_Fasilitasi_Beasiswa_BiroHukumRiau.pdf', fileSize: '1.2 MB', uploadedAt: '2024-07-28 10:15', uploadedBy: 'Fanny Nuraini, S.H.', fileUrl: '#' }
    ]
  },
  {
    id: 'REG-2024-012',
    nomor: '12/RAPERBUP/2024',
    judul: 'Rancangan Peraturan Bupati tentang Penanggulangan Karhutla Kawasan Gambut Indragiri Hulu',
    kabupaten: 'Kab. Indragiri Hulu',
    jenis: 'Raperbup',
    proja: 'Proja 3',
    status: STATUS_PERATURAN.DRAFT,
    updatedAt: '2024-08-06 09:00',
    uploadedBy: 'Citra Dewi, S.H., M.Kn.',
    keterangan: 'Draft baru diunggah oleh Bagian Hukum Inhu.',
    documents: [
      { typeIndex: 1, title: 'Draft Rancangan', fileName: 'Draft_Karhutla_Inhu.pdf', fileSize: '5.2 MB', uploadedAt: '2024-08-06 09:00', uploadedBy: 'Proja 3', fileUrl: '#' },
      null, null, null, null, null
    ]
  }
];
