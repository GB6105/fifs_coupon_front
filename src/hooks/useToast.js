import { useState, useCallback } from 'react';

export const useToast = () => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  // 메시지 타입 상태 (success | error | info)
  const [type, setType] = useState('info');

  // type 파라미터 추가 — 기본값 'info'
  const showMessage = useCallback((text, duration = 2500, toastType = 'info') => {
    setMessage(text);
    setType(toastType);
    setIsVisible(true);

    if (duration > 0) {
      setTimeout(() => {
        setIsVisible(false);
        setMessage('');
      }, duration);
    }
  }, []);

  const hideMessage = useCallback(() => {
    setIsVisible(false);
    setMessage('');
  }, []);

  return { message, isVisible, type, showMessage, hideMessage };
};