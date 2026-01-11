import { useEffect, useRef } from "react";

export function GlowCapture({
  children,
  className = "",
  glowColor = "rgba(91, 79, 228, 0.55)",
  glowSize = 260,
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      el.style.setProperty("--glow-x", `${x}px`);
      el.style.setProperty("--glow-y", `${y}px`);
      el.style.setProperty("--glow-opacity", "1");
    };

    const onLeave = () => {
      el.style.setProperty("--glow-opacity", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`glow-capture ${className}`}
      style={{
        // @ts-expect-error CSS custom props
        "--glow-color": glowColor,
        // @ts-expect-error CSS custom props
        "--glow-size": `${glowSize}px`,
      }}
    >
      <div className="glow-overlay rounded-[inherit]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
