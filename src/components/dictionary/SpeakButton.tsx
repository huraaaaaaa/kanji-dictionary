'use client';

import { useTTS } from '@/hooks/useTTS';

interface SpeakButtonProps {
  text: string;
  label?: string;
  size?: 'sm' | 'md';
}

export default function SpeakButton({ text, label, size = 'md' }: SpeakButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useTTS();

  if (!isSupported) return null;

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  const sizeClass = size === 'sm' ? 'p-1.5 min-w-[36px] min-h-[36px]' : 'p-2 min-w-[44px] min-h-[44px]';
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <button
      onClick={handleClick}
      aria-label={isSpeaking ? '停止' : `${label ?? text}を読み上げる`}
      className={`${sizeClass} rounded-lg flex items-center justify-center transition-colors ${
        isSpeaking
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          : 'text-gray-500 hover:bg-gray-100 active:bg-gray-200'
      }`}
    >
      {isSpeaking ? (
        <span className="relative flex">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-50" style={{ width: iconSize, height: iconSize }} />
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        </span>
      ) : (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
