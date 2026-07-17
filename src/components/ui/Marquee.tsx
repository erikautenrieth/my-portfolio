export function Marquee({
  children,
  reverse = false,
}: {
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="group overflow-hidden mask-x-from-85% mask-x-to-100%">
      <div
        className={`flex w-max gap-3 pr-3 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused] ${
          reverse ? "[animation-direction:reverse]" : ""
        }`}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
