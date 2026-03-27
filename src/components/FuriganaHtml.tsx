interface FuriganaHtmlProps {
  html: string;
  className?: string;
}

export default function FuriganaHtml({ html, className }: FuriganaHtmlProps) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
