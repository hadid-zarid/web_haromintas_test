import { useCallback, useRef, useState } from 'react';
import { sendChat } from '../lib/aiApi';

// Riwayat percakapan asisten AI. Konteks dokumen dikirim sebagai laporan lengkap supaya asisten
// bisa menjawab pertanyaan tentang temuan; `blockContext` mengarahkan pertanyaan ke satu blok.
export function useAiChat(report) {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const send = useCallback(
    async (text, blockContext) => {
      const message = text.trim();
      if (!message || sending) return;

      const history = messagesRef.current.map(({ role, content }) => ({ role, content }));
      setMessages((prev) => [...prev, { role: 'user', content: message }]);
      setSending(true);
      const startedAt = Date.now();
      try {
        const reply = await sendChat({ message, history, report, blockContext });
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: reply, seconds: (Date.now() - startedAt) / 1000 },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}`, failed: true },
        ]);
      } finally {
        setSending(false);
      }
    },
    [report, sending]
  );

  const clear = useCallback(() => setMessages([]), []);

  return { messages, sending, send, clear };
}
