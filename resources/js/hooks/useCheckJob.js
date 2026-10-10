import { useCallback, useEffect, useRef, useState } from 'react';
import { getCheckStatus, startCheck } from '../lib/aiApi';

const POLL_INTERVAL_MS = 1500;
// Toleran terhadap kegagalan sesaat (server AI restart dsb): ~60 detik sebelum menyerah.
const MAX_CONSECUTIVE_FAILURES = 40;

const IDLE = { phase: 'idle', completed: 0, total: 0, eta: null, errors: [] };

// Mengelola satu pemeriksaan dokumen: mulai, polling progres, selesai/gagal, dan pembatalan.
export function useCheckJob({ onDone, onError }) {
  const [state, setState] = useState(IDLE);
  const timer = useRef(null);
  const failures = useRef(0);
  const seenErrors = useRef(new Set());
  const mounted = useRef(true);
  const callbacks = useRef({ onDone, onError });
  callbacks.current = { onDone, onError };

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      stop();
    };
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setState(IDLE);
  }, [stop]);

  const start = useCallback(
    async (file, selectedRefs) => {
      stop();
      failures.current = 0;
      seenErrors.current = new Set();
      setState({ ...IDLE, phase: 'running' });

      try {
        const { job_id: jobId, total_blocks: total } = await startCheck(file, selectedRefs);
        if (!mounted.current) return;
        setState((s) => ({ ...s, total: total ?? 0 }));

        timer.current = setInterval(async () => {
          let job = null;
          try {
            job = await getCheckStatus(jobId);
            failures.current = 0;
          } catch {
            failures.current += 1;
            if (failures.current >= MAX_CONSECUTIVE_FAILURES) {
              stop();
              if (mounted.current) {
                setState(IDLE);
                callbacks.current.onError?.('Server AI tidak merespons setelah beberapa kali percobaan.');
              }
            }
            return;
          }
          if (!mounted.current) return;

          if (job.status === 'done') {
            stop();
            setState(IDLE);
            callbacks.current.onDone?.(job.report);
            return;
          }
          if (job.status === 'error') {
            stop();
            setState(IDLE);
            callbacks.current.onError?.(job.error_message || 'Analisis dokumen gagal diproses.');
            return;
          }

          const fresh = (job.errors || []).filter((e) => {
            const key = `${e.block_id}:${e.message}`;
            if (seenErrors.current.has(key)) return false;
            seenErrors.current.add(key);
            return true;
          });
          setState((s) => ({
            phase: 'running',
            completed: job.completed_blocks ?? s.completed,
            total: job.total_blocks ?? s.total,
            eta: job.eta_seconds ?? null,
            errors: fresh.length ? [...s.errors, ...fresh] : s.errors,
          }));
        }, POLL_INTERVAL_MS);
      } catch (error) {
        stop();
        if (mounted.current) {
          setState(IDLE);
          callbacks.current.onError?.(error.message);
        }
      }
    },
    [stop]
  );

  return { ...state, start, reset, running: state.phase === 'running' };
}
