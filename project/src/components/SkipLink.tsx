interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[9999]
        px-6 py-3
        bg-amber-500 text-black font-bold rounded-lg
        focus:outline-none focus:ring-4 focus:ring-amber-500/50
        transition-all
      "
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
    </>
  );
}
