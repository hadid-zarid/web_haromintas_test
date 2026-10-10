import React, { useCallback, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { BookMarked, FileSearch, History, Info } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AiPageHeader from '../components/ai/AiPageHeader';
import UploadCard from '../components/ai/UploadCard';
import ReferencePicker from '../components/ai/ReferencePicker';
import ProgressCard from '../components/ai/ProgressCard';
import ResultsView from '../components/ai/ResultsView';
import GuidelinesTab from '../components/ai/GuidelinesTab';
import HistoryTab from '../components/ai/HistoryTab';
import ChatDrawer from '../components/ai/ChatDrawer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useAiStatus } from '../hooks/useAiStatus';
import { useCheckJob } from '../hooks/useCheckJob';
import { useAiChat } from '../hooks/useAiChat';
import { listGuidelines } from '../lib/aiApi';
import { isDocx } from '../lib/aiReport';

// Halaman AI Document Checker di Harmonitas. Tata letak mengikuti aplikasi AI Document Checker:
// header (logo, tab, status), lalu pada tab Pemeriksaan berurutan banner skor, kartu statistik,
// panel dokumen referensi, dropzone (langsung memulai pemeriksaan), dan hasil dua panel. Tab Dokumen
// Pedoman dan Riwayat Laporan hanya untuk Admin. Layanan AI diakses lewat path same-origin /ai-api.
const AIAssistantPage = () => {
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const { state: aiState, status, refresh: refreshStatus } = useAiStatus();

  const [tab, setTab] = useState('check');
  const [fileName, setFileName] = useState('');
  const [report, setReport] = useState(null);
  const [reportKey, setReportKey] = useState(0);

  const [guidelines, setGuidelines] = useState([]);
  const [guidelinesLoading, setGuidelinesLoading] = useState(true);
  const [guidelinesError, setGuidelinesError] = useState(null);
  const [selectedRefs, setSelectedRefs] = useState(() => new Set());

  const [chatOpen, setChatOpen] = useState(false);
  const [focusBlock, setFocusBlock] = useState(null);

  const showReport = useCallback((next) => {
    setReport(next);
    setReportKey((k) => k + 1);
    setTab('check');
  }, []);

  const job = useCheckJob({
    onDone: (done) => {
      showReport(done);
      refreshStatus();
    },
    onError: (message) => showToast(`Gagal menganalisis dokumen: ${message}`, 'error'),
  });

  const chat = useAiChat(report);
  const clearChat = chat.clear;

  // Laporan baru = percakapan baru (riwayat chat lama membahas dokumen lain).
  useEffect(() => {
    clearChat();
    setFocusBlock(null);
  }, [reportKey, clearChat]);

  const loadGuidelines = useCallback(async () => {
    setGuidelinesLoading(true);
    setGuidelinesError(null);
    try {
      setGuidelines(await listGuidelines());
    } catch (e) {
      setGuidelinesError(e.message);
    } finally {
      setGuidelinesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuidelines();
  }, [loadGuidelines]);

  const tabs = [
    { key: 'check', label: 'Pemeriksaan', icon: FileSearch },
    ...(isAdmin
      ? [
          { key: 'guidelines', label: 'Dokumen Pedoman', icon: BookMarked },
          { key: 'history', label: 'Riwayat Laporan', icon: History },
        ]
      : []),
  ];
  const activeTab = tabs.some((t) => t.key === tab) ? tab : 'check';

  const startCheck = (file) => {
    setFileName(file.name);
    job.start(file, [...selectedRefs]);
  };

  const commentsAvailable = Boolean(status?.source_files_enabled) && isDocx(report?.document_checked);
  const showResults = Boolean(report) && !job.running;

  const openChat = () => {
    setFocusBlock(null);
    setChatOpen(true);
  };
  const askAboutBlock = (block) => {
    setFocusBlock(block);
    setChatOpen(true);
  };

  // Bagian tengah tab Pemeriksaan: panel referensi, lalu dropzone (atau progres saat memeriksa).
  const middle = (
    <>
      <ReferencePicker
        guidelines={guidelines}
        selected={selectedRefs}
        onChange={setSelectedRefs}
        loading={guidelinesLoading}
        error={guidelinesError}
      />
      {job.running ? (
        <ProgressCard fileName={fileName} completed={job.completed} total={job.total} eta={job.eta} errors={job.errors} />
      ) : (
        <UploadCard onFile={startCheck} />
      )}
    </>
  );

  return (
    <AppLayout>
      <Head title="Asisten AI Pra-Harmonisasi - HARMONITAS" />
      <div className="space-y-5 font-sans">
        <AiPageHeader tabs={tabs} activeTab={activeTab} onTabChange={setTab} aiState={aiState} status={status} />

        <div id="ai-panel-check" role="tabpanel" aria-labelledby="ai-tab-check" hidden={activeTab !== 'check'} className="space-y-5">
          {showResults ? (
            <ResultsView
              key={reportKey}
              report={report}
              middle={middle}
              commentsAvailable={commentsAvailable}
              onOpenChat={openChat}
              onAskAi={askAboutBlock}
            />
          ) : (
            <div className="space-y-5">{middle}</div>
          )}

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong className="font-bold text-[#2B3056]">Catatan:</strong> Hasil pemeriksaan sistem bersifat rekomendasi
              teknis awal. Keputusan substansi hukum tetap berada pada kewenangan Tim Perancang Kanwil dan Biro Hukum.
            </p>
          </div>
        </div>

        {isAdmin && activeTab === 'guidelines' && (
          <div id="ai-panel-guidelines" role="tabpanel" aria-labelledby="ai-tab-guidelines">
            <GuidelinesTab
              indexedChunks={status?.indexed_chunks}
              onChanged={() => {
                refreshStatus();
                loadGuidelines();
              }}
            />
          </div>
        )}

        {isAdmin && activeTab === 'history' && (
          <div id="ai-panel-history" role="tabpanel" aria-labelledby="ai-tab-history">
            <HistoryTab onOpenReport={showReport} />
          </div>
        )}
      </div>

      <footer className="mt-6 pb-2 text-center text-[11.5px] text-slate-400">
        AI Document Checker &copy; {new Date().getFullYear()} &bull; Powered by OpenRouter AI &bull; Track Changes &amp;
        Executive Audit Exporter &bull; PUEBI/EYD &amp; KBBI Compliance Engine
      </footer>

      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        hasReport={Boolean(report)}
        messages={chat.messages}
        sending={chat.sending}
        onSend={(text) => chat.send(text, focusBlock?.original_text)}
        onClear={chat.clear}
        focusBlock={focusBlock}
        onClearFocus={() => setFocusBlock(null)}
      />
    </AppLayout>
  );
};

export default AIAssistantPage;
