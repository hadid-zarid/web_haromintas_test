export const ROLES = {
  TIM_KERJA_1: 'Tim Kerja 1',
  TIM_KERJA_2: 'Tim Kerja 2',
  TIM_KERJA_3: 'Tim Kerja 3',
  KAKANWIL: 'Kakanwil',
  KADIV: 'Kadiv',
  BIRO_HUKUM: 'Biro Hukum',
};

export const MOCK_USERS = [
  {
    id: 'usr-1',
    name: 'Ahmad Subandi, S.H.',
    nip: '19850312 201012 1 002',
    role: ROLES.TIM_KERJA_1,
    unit: 'Kanwil Kemenkum Riau - Tim Kerja 1',
    email: 'timkerja1.riau@kemenkum.go.id',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    kabupatenScope: ['Kota Pekanbaru', 'Kab. Kampar', 'Kab. Pelalawan', 'Kab. Siak']
  },
  {
    id: 'usr-2',
    name: 'Budi Santoso, M.H.',
    nip: '19820719 200804 1 001',
    role: ROLES.TIM_KERJA_2,
    unit: 'Kanwil Kemenkum Riau - Tim Kerja 2',
    email: 'timkerja2.riau@kemenkum.go.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    kabupatenScope: ['Kota Dumai', 'Kab. Bengkalis', 'Kab. Rokan Hilir', 'Kab. Rokan Hulu']
  },
  {
    id: 'usr-3',
    name: 'Citra Dewi, S.H., M.Kn.',
    nip: '19900105 201402 2 003',
    role: ROLES.TIM_KERJA_3,
    unit: 'Kanwil Kemenkum Riau - Tim Kerja 3',
    email: 'timkerja3.riau@kemenkum.go.id',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    kabupatenScope: ['Kab. Indragiri Hilir', 'Kab. Indragiri Hulu', 'Kab. Kuantan Singingi', 'Kab. Kepulauan Meranti']
  },
  {
    id: 'usr-4',
    name: 'Drs. Hendra Gunawan, M.Si.',
    nip: '19750510 199903 1 005',
    role: ROLES.KAKANWIL,
    unit: 'Kepala Kantor Wilayah Kemenkum Riau',
    email: 'kakanwil.riau@kemenkum.go.id',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    kabupatenScope: ['Seluruh Wilayah Riau']
  },
  {
    id: 'usr-5',
    name: 'Eka Rachman, S.H., M.H.',
    nip: '19781122 200212 1 004',
    role: ROLES.KADIV,
    unit: 'Kepala Divisi Pelayanan Hukum Riau',
    email: 'kadiv.yankum.riau@kemenkum.go.id',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    kabupatenScope: ['Seluruh Wilayah Riau']
  },
  {
    id: 'usr-6',
    name: 'Fanny Nuraini, S.H.',
    nip: '19870914 201201 2 006',
    role: ROLES.BIRO_HUKUM,
    unit: 'Biro Hukum Setda Provinsi Riau',
    email: 'birohukum@riau.go.id',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    kabupatenScope: ['Provinsi Riau']
  }
];
