// Penerjemah markdown kecil dan AMAN untuk jawaban asisten AI. Hanya menghasilkan struktur data
// (bukan HTML), sehingga React yang merender dan tidak ada risiko XSS dari teks model.
// Didukung: judul, paragraf, daftar bernomor/berpoin, kutipan, tabel, garis, blok kode,
// serta **tebal**, *miring*, dan `kode` di dalam baris. Tautan sengaja tidak diproses.

export function parseInline(text) {
  const tokens = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ type: 'text', value: text.slice(last, m.index) });
    const raw = m[0];
    if (raw.startsWith('**')) tokens.push({ type: 'strong', value: raw.slice(2, -2) });
    else if (raw.startsWith('`')) tokens.push({ type: 'code', value: raw.slice(1, -1) });
    else tokens.push({ type: 'em', value: raw.slice(1, -1) });
    last = m.index + raw.length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

const splitRow = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());

const isTableSeparator = (line) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line) && line.includes('-');
const LIST_RE = /^\s*([-*+]|\d+[.)])\s+(.*)$/;

export function parseMarkdown(markdown) {
  const lines = String(markdown ?? '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^\s*```/.test(line)) {
      const code = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, inlines: parseInline(heading[2].trim()) });
      i += 1;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitRow(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      blocks.push({
        type: 'table',
        header: header.map(parseInline),
        rows: rows.map((r) => r.map(parseInline)),
      });
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quote = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', inlines: parseInline(quote.join('\n')) });
      continue;
    }

    if (LIST_RE.test(line)) {
      const ordered = /^\s*\d/.test(line);
      const items = [];
      while (i < lines.length && LIST_RE.test(lines[i])) {
        items.push(parseInline(lines[i].match(LIST_RE)[2]));
        i += 1;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*```/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !LIST_RE.test(lines[i]) &&
      !/^\s*>/.test(lines[i]) &&
      !lines[i].trim().startsWith('|')
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: 'paragraph', inlines: parseInline(para.join('\n')) });
  }

  return blocks;
}
