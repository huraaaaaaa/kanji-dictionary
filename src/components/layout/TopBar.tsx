'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export default function TopBar({ title = '国語辞典', showBack = false }: TopBarProps) {
  const router = useRouter();
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      {/* md: offset left by sidebar width (w-20 = 80px) */}
      <div className="md:ml-20 max-w-4xl mx-auto flex items-center h-14 px-4 gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            aria-label="戻る"
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {!showBack && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
          </Link>
        )}
        <h1 className="text-lg font-bold text-blue-900 flex-1">{title}</h1>
      </div>
    </header>
  );
}
