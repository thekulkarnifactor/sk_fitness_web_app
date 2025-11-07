import { useEffect, useRef } from 'react';

type Priority = 'polite' | 'assertive' | 'off';

interface LiveRegionProps {
  message: string;
  priority?: Priority;
  clearAfter?: number;
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  message,
  priority = 'polite',
  clearAfter,
  atomic = true,
  className = 'sr-only'
}: LiveRegionProps) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (clearAfter && message) {
      timeoutRef.current = setTimeout(() => {
        // Message will naturally clear when component re-renders with empty message
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic={atomic}
      className={className}
    >
      {message}
    </div>
  );
}

export function useLiveRegion() {
  const messageRef = useRef<string>('');

  const announce = (message: string, priority: Priority = 'polite') => {
    messageRef.current = message;
    return {
      message: messageRef.current,
      priority
    };
  };

  return { announce, message: messageRef.current };
}
