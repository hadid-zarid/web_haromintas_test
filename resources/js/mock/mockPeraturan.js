export const STATUS_PERATURAN = {
  DRAFT: 'draft',
  PROSES: 'proses',
  HARMONISASI: 'harmonisasi',
  FASILITASI: 'fasilitasi',
  SELESAI: 'selesai',
  REVISI: 'revisi',
};

export const KABUPATEN_LIST = [
  'Kota Pekanbaru',
  'Kota Dumai',
  'Kab. Kampar',
  'Kab. Bengkalis',
  'Kab. Indragiri Hilir',
  'Kab. Indragiri Hulu',
  'Kab. Pelalawan',
  'Kab. Rokan Hilir',
  'Kab. Rokan Hulu',
  'Kab. Siak',
  'Kab. Kuantan Singingi',
  'Kab. Kepulauan Meranti',
];

export const JENIS_PERATURAN = [
  'Rancangan Peraturan Daerah (Ranperda)',
  'Rancangan Peraturan Kepala Daerah (Ranperkada)',
  'Rancangan Peraturan DPRD',
];

export const DOCUMENT_TYPES = [
  { typeIndex: 1, title: 'Draft Rancangan Peraturan', role: 'Tim Kerja' },
  { typeIndex: 2, title: 'Analisa Konsepsi', role: 'Tim Kerja' },
  { typeIndex: 3, title: 'Matrix Perubahan / Sandingan', role: 'Tim Kerja' },
  { typeIndex: 4, title: 'Draft Hasil Harmonisasi', role: 'Tim Kerja' },
  { typeIndex: 5, title: 'Surat Hasil Harmonisasi', role: 'Tim Kerja' },
  { typeIndex: 6, title: 'Surat Hasil Fasilitasi', role: 'Biro Hukum' },
];

export const INITIAL_PERATURAN = [
  {
    id: 'REG-2024-001',
    nomor: '01/RAPERDA/2024',
    judul: 'Rancangan Peraturan Daerah tentang Rencana Tata Ruang Wilayah Kota Pekanbaru Tahun 2024-2044',
    kabupaten: 'Kota Pekanbaru',
    jenis: 'Rancangan Peraturan Daerah (Ranperda)',
    proja: 'Tim Kerja 1',
    status: STATUS_PERATURAN.SELESAI,
    isNew: false,
    updatedAt: '2024-03-20 14:30',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Harmonisasi dan Fasilitasi tuntas diterbitkan',
    documents: [
      { typeIndex: 1, fileName: '01_draft_rtrw_pku_2024.pdf', fileSize: '2.4 MB', uploadedAt: '2024-03-01 09:00', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 2, fileName: '02_analisa_konsepsi_rtrw.pdf', fileSize: '1.1 MB', uploadedAt: '2024-03-03 11:15', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 3, fileName: '03_matrix_sandingan_rtrw.docx', fileSize: '850 KB', uploadedAt: '2024-03-07 14:20', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 4, fileName: '04_draft_final_harmonisasi_rtrw.pdf', fileSize: '2.6 MB', uploadedAt: '2024-03-12 16:00', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 5, fileName: '05_surat_hasil_harmonisasi_kanwil_01.pdf', fileSize: '520 KB', uploadedAt: '2024-03-15 10:30', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 6, fileName: '06_surat_fasilitasi_birohukum_riau_01.pdf', fileSize: '640 KB', uploadedAt: '2024-03-20 14:30', uploadedBy: 'Fanny Nuraini, S.H.' }
    ]
  },
  {
    id: 'REG-2024-002',
    nomor: '02/PERKADA/2024',
    judul: 'Rancangan Peraturan Walikota Dumai tentang Pengelolaan Sampah dan Retribusi Kebersihan',
    kabupaten: 'Kota Dumai',
    jenis: 'Rancangan Peraturan Kepala Daerah (Ranperkada)',
    proja: 'Tim Kerja 2',
    status: STATUS_PERATURAN.FASILITASI,
    isNew: false,
    updatedAt: '2024-03-18 11:20',
    uploadedBy: 'Budi Santoso, M.H.',
    keterangan: 'Menunggu telaah Surat Fasilitasi dari Biro Hukum Setda Provinsi Riau',
    documents: [
      { typeIndex: 1, fileName: '01_draft_perwako_sampah_dumai.pdf', fileSize: '1.8 MB', uploadedAt: '2024-03-02 10:00', uploadedBy: 'Budi Santoso, M.H.' },
      { typeIndex: 2, fileName: '02_analisa_konsepsi_dumai.pdf', fileSize: '980 KB', uploadedAt: '2024-03-05 13:45', uploadedBy: 'Budi Santoso, M.H.' },
      { typeIndex: 3, fileName: '03_matrix_sandingan_dumai.docx', fileSize: '720 KB', uploadedAt: '2024-03-10 15:30', uploadedBy: 'Budi Santoso, M.H.' },
      { typeIndex: 4, fileName: '04_draft_final_harmonisasi_dumai.pdf', fileSize: '2.1 MB', uploadedAt: '2024-03-14 09:15', uploadedBy: 'Budi Santoso, M.H.' },
      { typeIndex: 5, fileName: '05_surat_hasil_harmonisasi_kanwil_02.pdf', fileSize: '490 KB', uploadedAt: '2024-03-18 11:20', uploadedBy: 'Budi Santoso, M.H.' },
      null
    ]
  },
  {
    id: 'REG-2024-003',
    nomor: '03/RAPERDA/2024',
    judul: 'Rancangan Peraturan Daerah Kabupaten Kampar tentang Pelestarian dan Pengembangan Adat Budaya Melayu Kampar',
    kabupaten: 'Kab. Kampar',
    jenis: 'Rancangan Peraturan Daerah (Ranperda)',
    proja: 'Tim Kerja 1',
    status: STATUS_PERATURAN.HARMONISASI,
    isNew: true,
    updatedAt: '2024-03-22 09:15',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Penyusunan pasal sandingan dan pembahasan rapat pleno Tim Kerja',
    documents: [
      { typeIndex: 1, fileName: '01_draft_raperda_adat_kampar.pdf', fileSize: '3.1 MB', uploadedAt: '2024-03-10 08:30', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 2, fileName: '02_analisa_konsepsi_adat_kampar.pdf', fileSize: '1.4 MB', uploadedAt: '2024-03-12 10:20', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 3, fileName: '03_matrix_sandingan_kampar.docx', fileSize: '950 KB', uploadedAt: '2024-03-22 09:15', uploadedBy: 'Ahmad Subandi, S.H.' },
      null,
      null,
      null
    ]
  },
  {
    id: 'REG-2024-004',
    nomor: '04/RAPERDA/2024',
    judul: 'Rancangan Peraturan Daerah Kabupaten Siak tentang Penyelenggaraan Smart City dan Keterbukaan Informasi Publik',
    kabupaten: 'Kab. Siak',
    jenis: 'Rancangan Peraturan Daerah (Ranperda)',
    proja: 'Tim Kerja 1',
    status: STATUS_PERATURAN.PROSES,
    isNew: true,
    updatedAt: '2024-03-24 15:40',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Pemeriksaan awal kelengkapan naskah akademik & draft regulasi',
    documents: [
      { typeIndex: 1, fileName: '01_draft_smartcity_siak.pdf', fileSize: '1.9 MB', uploadedAt: '2024-03-24 14:00', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 2, fileName: '02_analisa_konsepsi_siak.pdf', fileSize: '850 KB', uploadedAt: '2024-03-24 15:40', uploadedBy: 'Ahmad Subandi, S.H.' },
      null,
      null,
      null,
      null
    ]
  },
  {
    id: 'REG-2024-005',
    nomor: '05/PERKADA/2024',
    judul: 'Rancangan Peraturan Bupati Bengkalis tentang Rencana Penanggulangan Bencana Karhutla 2024-2029',
    kabupaten: 'Kab. Bengkalis',
    jenis: 'Rancangan Peraturan Kepala Daerah (Ranperkada)',
    proja: 'Tim Kerja 2',
    status: STATUS_PERATURAN.DRAFT,
    isNew: true,
    updatedAt: '2024-03-25 10:00',
    uploadedBy: 'Budi Santoso, M.H.',
    keterangan: 'Permohonan baru masuk, menunggu telaah Dokumen 1 & 2',
    documents: [
      { typeIndex: 1, fileName: '01_draft_perbup_karhutla_bengkalis.pdf', fileSize: '4.2 MB', uploadedAt: '2024-03-25 10:00', uploadedBy: 'Budi Santoso, M.H.' },
      null,
      null,
      null,
      null,
      null
    ]
  },
  {
    id: 'REG-2024-006',
    nomor: '06/RAPERDA/2024',
    judul: 'Rancangan Peraturan Daerah Kabupaten Indragiri Hilir tentang Pemberdayaan Petani Kelapa dan Hilirisasi Perkebunan',
    kabupaten: 'Kab. Indragiri Hilir',
    jenis: 'Rancangan Peraturan Daerah (Ranperda)',
    proja: 'Tim Kerja 3',
    status: STATUS_PERATURAN.SELESAI,
    isNew: false,
    updatedAt: '2024-03-15 16:20',
    uploadedBy: 'Citra Dewi, S.H., M.Kn.',
    keterangan: 'Harmonisasi dan Fasilitasi tuntas diterbitkan',
    documents: [
      { typeIndex: 1, fileName: '01_draft_raperda_kelapa_inhil.pdf', fileSize: '2.2 MB', uploadedAt: '2024-02-20 09:00', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 2, fileName: '02_analisa_konsepsi_inhil.pdf', fileSize: '1.0 MB', uploadedAt: '2024-02-23 11:30', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 3, fileName: '03_matrix_sandingan_inhil.docx', fileSize: '810 KB', uploadedAt: '2024-02-28 14:00', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 4, fileName: '04_draft_final_harmonisasi_inhil.pdf', fileSize: '2.4 MB', uploadedAt: '2024-03-05 15:30', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 5, fileName: '05_surat_hasil_harmonisasi_kanwil_06.pdf', fileSize: '480 KB', uploadedAt: '2024-03-10 10:15', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 6, fileName: '06_surat_fasilitasi_birohukum_riau_06.pdf', fileSize: '590 KB', uploadedAt: '2024-03-15 16:20', uploadedBy: 'Fanny Nuraini, S.H.' }
    ]
  },
  {
    id: 'REG-2024-007',
    nomor: '07/RAPERDA/2024',
    judul: 'Rancangan Peraturan Daerah Kabupaten Kuantan Singingi tentang Pelestarian Tradisi Pacu Jalur sebagai Warisan Budaya Nasional',
    kabupaten: 'Kab. Kuantan Singingi',
    jenis: 'Rancangan Peraturan Daerah (Ranperda)',
    proja: 'Tim Kerja 3',
    status: STATUS_PERATURAN.HARMONISASI,
    isNew: false,
    updatedAt: '2024-03-21 14:00',
    uploadedBy: 'Citra Dewi, S.H., M.Kn.',
    keterangan: 'Penyusunan Draft Hasil setelah pembahasan rapat pleno',
    documents: [
      { typeIndex: 1, fileName: '01_draft_pacu_jalur_kuansing.pdf', fileSize: '3.0 MB', uploadedAt: '2024-03-05 08:30', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 2, fileName: '02_analisa_konsepsi_kuansing.pdf', fileSize: '1.2 MB', uploadedAt: '2024-03-08 10:15', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 3, fileName: '03_matrix_sandingan_kuansing.docx', fileSize: '790 KB', uploadedAt: '2024-03-14 13:45', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      { typeIndex: 4, fileName: '04_draft_final_harmonisasi_kuansing.pdf', fileSize: '2.9 MB', uploadedAt: '2024-03-21 14:00', uploadedBy: 'Citra Dewi, S.H., M.Kn.' },
      null,
      null
    ]
  },
  {
    id: 'REG-2024-008',
    nomor: '08/PERKADA/2024',
    judul: 'Rancangan Peraturan Bupati Pelalawan tentang Pengendalian Mutu Layanan Kesehatan Puskesmas',
    kabupaten: 'Kab. Pelalawan',
    jenis: 'Rancangan Peraturan Kepala Daerah (Ranperkada)',
    proja: 'Tim Kerja 1',
    status: STATUS_PERATURAN.SELESAI,
    isNew: false,
    updatedAt: '2024-03-14 11:30',
    uploadedBy: 'Ahmad Subandi, S.H.',
    keterangan: 'Harmonisasi dan Fasilitasi tuntas diterbitkan',
    documents: [
      { typeIndex: 1, fileName: '01_draft_perbup_puskesmas_pelalawan.pdf', fileSize: '1.6 MB', uploadedAt: '2024-02-15 09:30', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 2, fileName: '02_analisa_konsepsi_pelalawan.pdf', fileSize: '920 KB', uploadedAt: '2024-02-18 11:00', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 3, fileName: '03_matrix_sandingan_pelalawan.docx', fileSize: '650 KB', uploadedAt: '2024-02-25 14:30', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 4, fileName: '04_draft_final_pelalawan.pdf', fileSize: '1.8 MB', uploadedAt: '2024-03-02 16:00', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 5, fileName: '05_surat_hasil_harmonisasi_kanwil_08.pdf', fileSize: '470 KB', uploadedAt: '2024-03-08 10:30', uploadedBy: 'Ahmad Subandi, S.H.' },
      { typeIndex: 6, fileName: '06_surat_fasilitasi_birohukum_riau_08.pdf', fileSize: '530 KB', uploadedAt: '2024-03-14 11:30', uploadedBy: 'Fanny Nuraini, S.H.' }
    ]
  }
];
