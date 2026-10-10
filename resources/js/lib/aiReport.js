// Fungsi murni untuk laporan hasil pemeriksaan AI Document Checker (tanpa React, mudah diuji).

export const STATUS_META = {
  sesuai: { label: 'Sesuai', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  perlu_revisi: { label: 'Perlu Revisi', badge: 'bg-red-50 text-red-700 border-red-200' },
  ejaan_tanda_baca: { label: 'Ejaan & Tanda Baca', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  tidak_ditemukan_rujukan: { label: 'Tanpa Rujukan', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  gagal_dianalisis: { label: 'Gagal Dianalisis', badge: 'bg-red-50 text-red-700 border-red-300 border-dashed' },
};

export const ERROR_TYPE_LABELS = {
  pedoman: 'Pedoman/UU',
  ejaan: 'Ejaan',
  tanda_baca: 'Tanda Baca',
  kosa_kata: 'Kosa Kata',
};

export const SEVERITY_LABELS = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' };

export const ERROR_TYPE_TAG = {
  pedoman: 'bg-red-50 text-red-700 border-red-200',
  ejaan: 'bg-amber-50 text-amber-800 border-amber-200',
  tanda_baca: 'bg-orange-50 text-orange-700 border-orange-200',
  kosa_kata: 'bg-purple-50 text-purple-700 border-purple-200',
};

export const SEVERITY_TAG = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-800 border-amber-200',
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

// Sorotan di panel naskah (latar muda + garis bawah tebal + teks gelap), sama dengan AI Document Checker.
export const HIGHLIGHT_CLASS = {
  pedoman: 'bg-[#fee2e2] border-b-2 border-[#dc2626] text-[#991b1b]',
  ejaan: 'bg-[#fef3c7] border-b-2 border-[#d97706] text-[#92400e]',
  tanda_baca: 'bg-[#ffedd5] border-b-2 border-[#ea580c] text-[#9a3412]',
  kosa_kata: 'bg-[#ede9fe] border-b-2 border-[#7c3aed] text-[#5b21b6]',
  gagal: 'bg-slate-100 border-b-2 border-dashed border-slate-400 text-slate-600',
};

// Kotak warna pekat pada legenda "Penanda".
export const SWATCH_CLASS = {
  pedoman: 'bg-[#dc2626]',
  ejaan: 'bg-[#d97706]',
  tanda_baca: 'bg-[#ea580c]',
  kosa_kata: 'bg-[#7c3aed]',
};

export const FILTERS = [
  { key: 'all', label: 'Semua Blok' },
  { key: 'perlu_revisi', label: 'Pedoman/UU' },
  { key: 'ejaan_tanda_baca', label: 'Ejaan & Tanda Baca' },
  { key: 'sesuai', label: 'Sesuai' },
  { key: 'tidak_ditemukan_rujukan', label: 'Tanpa Rujukan' },
  { key: 'gagal_dianalisis', label: 'Gagal' },
];

// Lencana grade selalu beraksen emas (seperti lencana kuning AI Document Checker); "-" = belum dinilai.
export function gradeBadgeClass(grade) {
  return grade && grade !== '-' ? 'bg-[#FFC800] !text-[#2B3056]' : 'bg-slate-400';
}

// Blok yang diberi sorotan di panel naskah (bukan sesuai / tanpa rujukan).
export function isIssueBlock(block) {
  return block.status !== 'sesuai' && block.status !== 'tidak_ditemukan_rujukan';
}

export function hasSuggestion(block) {
  return Boolean(block.suggested_revision) || (block.span_errors || []).length > 0;
}

// Revisi yang secara bawaan dianggap diterima (blok yang punya usulan revisi).
export function defaultAcceptedIds(report) {
  return new Set((report?.blocks || []).filter((b) => b.suggested_revision).map((b) => b.block_id));
}

export function formatEta(seconds) {
  if (seconds == null || Number.isNaN(Number(seconds))) return 'Menghitung estimasi waktu...';
  const s = Math.max(0, Math.round(Number(seconds)));
  if (s <= 1) return 'Hampir selesai...';
  if (s < 60) return `Sisa sekitar ${s} detik`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest ? `Sisa sekitar ${m} menit ${rest} detik` : `Sisa sekitar ${m} menit`;
}

export function formatDateTime(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? '-'
    : d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return '-';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// Ringkasan angka untuk kartu statistik (sub-skor 0 tetap 0, bukan jatuh ke 100).
export function summarizeReport(report) {
  const summary = report?.summary || {};
  const score = report?.compliance_score || null;
  const sub = score?.sub_scores || {};
  const pct = (v) => Math.round(v ?? 100);
  return {
    score: score ? Math.round(score.overall_score ?? 0) : null,
    grade: score?.grade ?? '-',
    predicate: score?.predicate ?? '',
    subScores: {
      pedoman: pct(sub.pedoman_score),
      ejaan: pct(sub.ejaan_score),
      punct: pct(sub.tanda_baca_kosa_kata_score),
      struct: pct(sub.struktur_hukum_score),
    },
    totalBlocks: summary.total_blocks ?? 0,
    sesuai: summary.sesuai ?? 0,
    perluRevisi: summary.perlu_revisi ?? 0,
    ejaanTandaBaca: summary.ejaan_tanda_baca ?? 0,
    gagal: summary.gagal_dianalisis ?? 0,
    totalErrors: summary.total_span_errors ?? 0,
    errTandaBaca: summary.errors_tanda_baca ?? 0,
    errKosaKata: summary.errors_kosa_kata ?? 0,
    longSentences: report?.legal_metrics?.long_sentences_count ?? 0,
    issueBlocks: (summary.perlu_revisi ?? 0) + (summary.ejaan_tanda_baca ?? 0),
  };
}

// Pecah teks blok menjadi segmen biasa dan segmen bersorot berdasarkan span_errors.
// Setiap kesalahan memakai kemunculan pertama yang belum terpakai (kata yang sama di dua
// tempat menyorot dua kemunculan berbeda), dan sorotan yang bertumpukan dibuang.
export function buildHighlightSegments(text, spanErrors) {
  const source = String(text ?? '');
  const matches = [];
  const usedStarts = new Set();

  (spanErrors || []).forEach((error, index) => {
    const snippet = error.original_snippet;
    if (!snippet) return;
    let from = 0;
    while (from <= source.length - snippet.length) {
      const pos = source.indexOf(snippet, from);
      if (pos === -1) break;
      if (!usedStarts.has(pos)) {
        usedStarts.add(pos);
        matches.push({ start: pos, end: pos + snippet.length, error, index });
        break;
      }
      from = pos + 1;
    }
  });

  matches.sort((a, b) => a.start - b.start);
  const kept = [];
  let lastEnd = -1;
  matches.forEach((m) => {
    if (m.start >= lastEnd) {
      kept.push(m);
      lastEnd = m.end;
    }
  });

  const segments = [];
  let cursor = 0;
  kept.forEach((m) => {
    if (m.start > cursor) segments.push({ text: source.slice(cursor, m.start) });
    segments.push({ text: source.slice(m.start, m.end), error: m.error, index: m.index });
    cursor = m.end;
  });
  if (cursor < source.length) segments.push({ text: source.slice(cursor) });
  return segments.length ? segments : [{ text: source }];
}

export function groupByPage(blocks) {
  const pages = new Map();
  blocks.forEach((b) => {
    const page = b.page_number || 1;
    if (!pages.has(page)) pages.set(page, []);
    pages.get(page).push(b);
  });
  return [...pages.entries()].sort((a, b) => a[0] - b[0]);
}

export function groupErrorsByType(spanErrors) {
  const groups = {};
  (spanErrors || []).forEach((e) => {
    const type = e.error_type || 'ejaan';
    (groups[type] ||= []).push(e);
  });
  return Object.entries(groups);
}

export function isDocx(filename = '') {
  return String(filename).toLowerCase().endsWith('.docx');
}
