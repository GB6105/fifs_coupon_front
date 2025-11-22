// src/hooks/useToast.js
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const showMessage = useCallback((text, duration = 2500) => {
    setMessage(text);
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

  return { message, isVisible, showMessage, hideMessage };
};