export function toKanjiVgHex(kanji: string): string {
  return (kanji.codePointAt(0) ?? 0).toString(16).padStart(5, '0');
}
