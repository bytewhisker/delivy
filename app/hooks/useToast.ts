import { useState } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const show = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToast({ id, message, type });
  };

  const dismiss = () => {
    setToast(null);
  };

  return { toast, show, dismiss };
}
