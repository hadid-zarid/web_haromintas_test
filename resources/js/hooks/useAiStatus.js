import { useCallback, useEffect, useState } from 'react';
import { getStatus } from '../lib/aiApi';

// Status layanan AI: 'loading' | 'ok' | 'error'. Dimuat saat halaman dibuka dan bisa disegarkan.
export function useAiStatus() {
  const [state, setState] = useState('loading');
  const [status, setStatus] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await getStatus());
      setState('ok');
    } catch {
      setStatus(null);
      setState('error');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { state, status, refresh };
}
