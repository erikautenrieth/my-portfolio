export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur-md transition-shadow hover:shadow-lg hover:shadow-cyan-400/20 ${className}`}
    >
      {children}
    </div>
  );
}
