import React, { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

interface ScrambleInProps {
  text: string;
  delay?: number;
  triggered?: boolean;
  className?: string;
}

export const ScrambleIn: React.FC<ScrambleInProps> = ({
  text,
  delay = 0,
  triggered = true,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState<string>('');
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!triggered) {
      setDisplayText('');
      setHasStarted(false);
      return;
    }

    const timer = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [triggered, delay]);

  useEffect(() => {
    if (!hasStarted) return;

    let cursor = 0;
    const interval = setInterval(() => {
      cursor += 0.5;
      const currentRevealIndex = Math.floor(cursor);

      if (currentRevealIndex >= text.length) {
        setDisplayText(text);
        clearInterval(interval);
        return;
      }

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < currentRevealIndex) {
          result += text[i];
        } else if (i < currentRevealIndex + 3) {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        } else {
          break;
        }
      }

      setDisplayText(result);
    }, 25);

    return () => clearInterval(interval);
  }, [hasStarted, text]);

  if (!hasStarted && !displayText) {
    return <span className={className}>&nbsp;</span>;
  }

  return <span className={className}>{displayText || text}</span>;
};
