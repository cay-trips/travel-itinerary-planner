import React, { useState, useEffect } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
  className?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  isHovered,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState<string>(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const framesPerChar = 4;
    const totalChars = text.length;

    const interval = setInterval(() => {
      frame++;
      const revealedChars = Math.floor(frame / framesPerChar);

      if (revealedChars >= totalChars) {
        setDisplayText(text);
        clearInterval(interval);
        return;
      }

      let result = '';
      for (let i = 0; i < totalChars; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedChars) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(result);
    }, 25);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return <span className={className}>{displayText}</span>;
};
