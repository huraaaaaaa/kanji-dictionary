'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toKanjiVgHex } from '@/lib/kanjiHex';

interface StrokeOrderProps {
  kanji: string;
}

type Status = 'loading' | 'loaded' | 'error';

export default function StrokeOrder({ kanji }: StrokeOrderProps) {
  const hex = toKanjiVgHex(kanji);
  const svgRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [svgHtml, setSvgHtml] = useState('');

  // Fetch the SVG file
  useEffect(() => {
    setStatus('loading');
    setSvgHtml('');
    fetch(`/kanji-svg/${hex}.svg`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const svgStart = text.indexOf('<svg');
        setSvgHtml(svgStart >= 0 ? text.slice(svgStart) : text);
        setStatus('loaded');
      })
      .catch(() => setStatus('error'));
  }, [hex]);

  // Animate strokes once SVG is injected into DOM
  useLayoutEffect(() => {
    if (status !== 'loaded' || !svgRef.current) return;
    applyAnimation(svgRef.current);
  }, [status, svgHtml]);

  const replay = () => {
    if (!svgRef.current) return;
    applyAnimation(svgRef.current);
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center w-[200px] h-[200px] bg-gray-100 rounded-xl animate-pulse">
        <span className="text-gray-400 text-xs"><ruby>読込中<rt>よみこみちゅう</rt></ruby></span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center w-[200px] h-[200px] bg-gray-50 rounded-xl border border-gray-200">
        <span className="text-6xl font-bold text-blue-900">{kanji}</span>
        <p className="text-xs text-gray-400 mt-2"><ruby>書<rt>か</rt></ruby>き<ruby>順<rt>じゅん</rt></ruby>データがありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={svgRef}
        className="w-[200px] h-[200px] bg-gray-50 rounded-xl border border-gray-100 overflow-hidden [&_svg]:w-full [&_svg]:h-full"
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
      <button
        onClick={replay}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
        </svg>
        もう一度
      </button>
    </div>
  );
}

function applyAnimation(container: HTMLDivElement) {
  // Hide stroke number labels (small, hard to read)
  const numGroup = container.querySelector('[id^="kvg:StrokeNumbers"]') as SVGElement | null;
  if (numGroup) numGroup.style.display = 'none';

  // Style the SVG itself
  const svgEl = container.querySelector('svg');
  if (svgEl) {
    svgEl.setAttribute('viewBox', '0 0 109 109');
    svgEl.style.width = '100%';
    svgEl.style.height = '100%';
  }

  // Collect stroke paths (KanjiVG ids: kvg:XXXXX-s1, kvg:XXXXX-s2, ...)
  const paths = Array.from(
    container.querySelectorAll<SVGPathElement>('path[id*="-s"]')
  ).filter((p) => /.*-s\d+$/.test(p.id));

  paths.forEach((path, i) => {
    // Cancel any running animations to allow replay
    path.getAnimations().forEach((a) => a.cancel());

    const len = path.getTotalLength();

    // Apply blue color consistent with the app palette
    path.style.stroke = '#1e40af';
    path.style.fill = 'none';
    path.style.strokeWidth = '3';
    path.style.strokeLinecap = 'round';

    // Set up dash — start fully hidden
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;

    // Animate via Web Animations API (no CSS keyframe needed)
    path.animate(
      [{ strokeDashoffset: `${len}` }, { strokeDashoffset: '0' }],
      { duration: 500, delay: i * 450, fill: 'forwards', easing: 'ease-in-out' }
    );
  });
}
