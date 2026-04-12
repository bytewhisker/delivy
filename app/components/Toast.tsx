'use client';

import { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  message: ToastMessage | null;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const bgColor = message.type === 'success' ? '#10b981' : '#ef4444';

  return (
    <div id="toast" className="toast show" style={{ background: bgColor }}>
      {message.message}
    </div>
  );
}
