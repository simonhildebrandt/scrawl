import { useCallback, useEffect } from 'react';

export default function useKeyCodeListener(callback, codes) {
  const action = useCallback(event => {
    codes.includes(event.code) && callback(event.code);
  }, [callback, codes]);

  useEffect(() => {
    window.addEventListener('keydown', action);
    return () => window.removeEventListener('keydown', action);
  }, [action])
}
