// Klien API layanan AI Document Checker (Python). Layanan itu berjalan di server yang sama dan
// diakses lewat path same-origin /ai-api (Caddy meneruskannya ke container ai-checker), jadi
// satu domain tanpa CORS/mixed-content. Lihat docker/Caddyfile.
export const AI_API_BASE_URL = '/ai-api';

export const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt', '.md', '.rtf', '.odt'];

export function isSupportedFile(name = '') {
  const lower = String(name).toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

async function readError(res, fallback) {
  const body = await res.json().catch(() => ({}));
  return typeof body?.detail === 'string' ? body.detail : fallback;
}

async function request(path, options, fallbackMessage) {
  const res = await fetch(`${AI_API_BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(await readError(res, fallbackMessage));
  return res;
}

const jsonPost = (body) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export async function getStatus() {
  const res = await request('/api/status', undefined, 'Server AI tidak merespons.');
  return res.json();
}

export async function listGuidelines() {
  const res = await request('/api/guidelines', undefined, 'Gagal memuat daftar pedoman.');
  return (await res.json()).guidelines || [];
}

export async function uploadGuidelines(files) {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append('files', f));
  const res = await request('/api/upload-guidelines', { method: 'POST', body: formData }, 'Gagal mengunggah pedoman.');
  return res.json();
}

export async function reindexGuidelines() {
  const res = await request('/api/index-guidelines', { method: 'POST' }, 'Indexing pedoman gagal.');
  return res.json();
}

export async function startCheck(file, selectedRefs) {
  const formData = new FormData();
  formData.append('file', file);
  if (selectedRefs && selectedRefs.length > 0) {
    formData.append('selected_refs', JSON.stringify(selectedRefs));
  }
  const res = await request('/api/check/start', { method: 'POST', body: formData }, 'Gagal memulai analisis dokumen di server AI.');
  return res.json();
}

export async function getCheckStatus(jobId) {
  const res = await request(`/api/check/status/${encodeURIComponent(jobId)}`, undefined, 'Gagal membaca status pemeriksaan.');
  return res.json();
}

export async function listReports() {
  const res = await request('/api/reports', undefined, 'Gagal memuat riwayat laporan.');
  return (await res.json()).reports || [];
}

export async function getReport(id) {
  const res = await request(`/api/reports/${encodeURIComponent(id)}`, undefined, 'Laporan tidak ditemukan atau gagal dimuat.');
  let report = await res.json();
  if (typeof report === 'string') report = JSON.parse(report);
  if (!report || !Array.isArray(report.blocks)) throw new Error('Format laporan tidak dikenali.');
  return report;
}

// Mengembalikan { blob, filename, placed, unplaced } untuk diunduh pemanggil.
export async function exportReport(report, mode, acceptedBlockIds = []) {
  const res = await request(
    '/api/export-docx',
    jsonPost({ report, mode, accepted_block_ids: acceptedBlockIds }),
    'Gagal membuat dokumen ekspor.'
  );
  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  return {
    blob: await res.blob(),
    filename: match ? match[1] : `hasil-analisa-${mode}.docx`,
    placed: parseInt(res.headers.get('X-Comments-Placed') || '0', 10),
    unplaced: parseInt(res.headers.get('X-Comments-Unplaced') || '0', 10),
  };
}

export async function sendChat({ message, history, report, blockContext }) {
  const res = await request(
    '/api/assistant/chat',
    jsonPost({
      message,
      chat_history: history,
      report: report || null,
      block_context: blockContext || null,
    }),
    'Asisten AI gagal merespons.'
  );
  return (await res.json()).reply || 'Tidak ada respons dari AI.';
}

export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
