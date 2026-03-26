interface FuriganaProps {
  word: string;
  reading: string;
  className?: string;
}

export default function Furigana({ word, reading, className }: FuriganaProps) {
  return (
    <ruby className={className}>
      {word}
      <rt className="text-xs font-normal">{reading}</rt>
    </ruby>
  );
}
