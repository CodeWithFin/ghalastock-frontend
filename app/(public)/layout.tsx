export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-white font-figtree antialiased selection:bg-landing-accent selection:text-background">
      {children}
    </div>
  );
}
