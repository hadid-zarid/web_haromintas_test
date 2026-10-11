import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import MarkdownView from '../ai/MarkdownView';

const MAX_LENGTH = 500;
const MAX_HISTORY = 6;

const SUGGESTIONS = [
  'Apa itu HARMONITAS?',
  'Bagaimana cara masuk ke sistem?',
  'Bagaimana cara mengajukan permohonan?',
  'Apa saja 7 dokumen berkas?',
  'Kabupaten saya masuk Tim Kerja berapa?',
  'Siapa yang bisa saya hubungi?',
];

const GREETING =
  'Halo! Saya **Asisten HARMONITAS**. Saya bisa membantu menjelaskan sistem ini dan cara memakainya. Silakan pilih pertanyaan di bawah atau ketik sendiri.';

async function askChatbot(message, history) {
  const csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
  let res;
  try {
    res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': csrf,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ message, history }),
    });
  } catch {
    throw new Error('Tidak bisa terhubung ke server. Periksa koneksi internet Anda.');
  }

  const data = await res.json().catch(() => ({}));
  if (res.ok) return data.reply;

  if (res.status === 419) throw new Error('Sesi halaman sudah kedaluwarsa. Muat ulang halaman lalu coba lagi.');
  // Batas per IP dari Laravel berbahasa Inggris; batas harian dari service sudah berbahasa Indonesia.
  if (res.status === 429 && (!data.message || /too many/i.test(data.message))) {
    throw new Error('Terlalu banyak pertanyaan dalam waktu singkat. Tunggu sebentar lalu coba lagi.');
  }
  if (res.status === 422) {
    throw new Error(Object.values(data.errors || {})[0]?.[0] || 'Pertanyaan tidak valid.');
  }
  throw new Error(data.message || 'Asisten sedang tidak tersedia. Coba lagi nanti.');
}

// Tombol chat melayang + panel percakapan untuk pengunjung landing page. Jawaban dirender lewat
// MarkdownView (tanpa HTML mentah), jadi teks dari model tidak pernah dieksekusi sebagai HTML.
const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Gulir ke pesan terbaru hanya saat ada percakapan; memakai scrollTop (bukan scrollIntoView)
  // supaya halaman landing di belakang panel tidak ikut tergulir.
  useEffect(() => {
    const list = listRef.current;
    if (list && (messages.length > 0 || sending)) list.scrollTop = list.scrollHeight;
  }, [messages, sending, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = useCallback(
    async (text) => {
      const message = text.trim();
      if (!message || sending) return;

      // Hanya percakapan yang berhasil (tanpa pesan galat) yang dikirim sebagai konteks.
      const history = messagesRef.current
        .filter((m) => !m.failed)
        .slice(-MAX_HISTORY)
        .map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, { role: 'user', content: message }]);
      setDraft('');
      setSending(true);
      try {
        const reply = await askChatbot(message, history);
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch (error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: error.message, failed: true }]);
      } finally {
        setSending(false);
      }
    },
    [sending]
  );

  const onSubmit = (e) => {
    e.preventDefault();
    send(draft);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  };

  const reset = () => {
    setMessages([]);
    setDraft('');
    inputRef.current?.focus();
  };

  return (
    <>
      {open && (
        <section
          role="dialog"
          aria-label="Asisten HARMONITAS"
          className="fixed z-[70] inset-x-3 bottom-[88px] sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[390px] h-[min(560px,calc(100dvh-7.5rem))] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-[#2B3056]/25"
        >
          <header className="flex items-center gap-3 bg-gradient-to-r from-[#2B3056] to-[#3F4780] px-4 py-3 text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFD82B] text-[#2B3056]">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold leading-tight">Asisten HARMONITAS</h2>
              <p className="text-[11px] text-white/70 leading-tight">Tanya cara pakai &amp; info sistem</p>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                aria-label="Mulai percakapan baru"
                title="Percakapan baru"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup asisten"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto bg-slate-50 px-3.5 py-4 space-y-3" aria-live="polite">
            <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 shadow-xs">
              <MarkdownView text={GREETING} />
            </div>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    disabled={sending}
                    className="min-h-[36px] rounded-full border border-[#2B3056]/20 bg-white px-3 py-1.5 text-left text-xs font-semibold text-[#2B3056] hover:border-[#2B3056] hover:bg-[#F3F4FA] cursor-pointer disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <p className="max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-[#2B3056] px-3.5 py-2 text-[13px] leading-relaxed text-white">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div
                  key={i}
                  className={`max-w-[92%] rounded-2xl rounded-tl-sm border px-3.5 py-2.5 shadow-xs ${
                    m.failed ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white'
                  }`}
                >
                  {m.failed ? <p className="text-xs leading-relaxed text-red-800">{m.content}</p> : <MarkdownView text={m.content} />}
                </div>
              )
            )}

            {sending && (
              <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Asisten sedang mengetik...
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <label htmlFor="chatbot-input" className="sr-only">
                  Pertanyaan Anda
                </label>
                <textarea
                  id="chatbot-input"
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
                  onKeyDown={onKeyDown}
                  rows={2}
                  maxLength={MAX_LENGTH}
                  placeholder="Tulis pertanyaan Anda..."
                  className="block w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2B3056] focus:outline-none focus:ring-2 focus:ring-[#2B3056]/20"
                />
              </div>
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                aria-label="Kirim pertanyaan"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2B3056] text-[#FFD82B] hover:bg-[#3F4780] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-snug text-slate-400">
              Jawaban dibuat AI dan bisa keliru. Jangan mengirim kata sandi atau data pribadi.
              <span className="float-right tabular-nums">{draft.length}/{MAX_LENGTH}</span>
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Tutup asisten bantuan' : 'Buka asisten bantuan'}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] flex h-14 items-center gap-2 rounded-full bg-gradient-to-br from-[#2B3056] to-[#3F4780] pl-4 pr-4 sm:pr-5 text-white shadow-xl shadow-[#2B3056]/30 ring-2 ring-[#FFD82B] hover:scale-105 transition-transform cursor-pointer"
      >
        {open ? <X className="h-5 w-5 text-[#FFD82B]" aria-hidden="true" /> : <MessageCircle className="h-5 w-5 text-[#FFD82B]" aria-hidden="true" />}
        <span className="hidden sm:inline text-sm font-bold">{open ? 'Tutup' : 'Tanya Asisten'}</span>
      </button>
    </>
  );
};

export default ChatbotWidget;
