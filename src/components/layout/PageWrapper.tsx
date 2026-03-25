interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main className={`md:ml-20 max-w-4xl mx-auto px-4 pt-20 pb-24 md:pb-8 ${className}`}>
      {children}
    </main>
  );
}
