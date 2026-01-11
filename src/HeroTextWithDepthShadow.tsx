import { motion, useScroll, useTransform } from "framer-motion";

export function HeroTextWithDepthShadow({
  text,
  className = "",
  shadowColorClass = "text-brand",
  scrollRange = 520,
}: {
  text: string;
  className?: string;
  shadowColorClass?: string;
  scrollRange?: number;
}) {
  const { scrollY } = useScroll();

  const textY = useTransform(scrollY, [0, scrollRange], [0, -180]);
  const shadowY = useTransform(scrollY, [0, scrollRange], [0, -38]);

  const blurPx = useTransform(scrollY, [0, scrollRange], [10, 44]);
  const blurFilter = useTransform(blurPx, (v) => `blur(${v}px)`);

  const shadowScale = useTransform(scrollY, [0, scrollRange], [1.02, 1.30]);
  const shadowOpacity = useTransform(scrollY, [0, 180, scrollRange], [0.30, 0.22, 0]);

  const shadowX = useTransform(scrollY, [0, scrollRange], [0, 14]);

  return (
    <div className="relative inline-block">
      <motion.span
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none select-none font-extrabold ${shadowColorClass}`}
        style={{
          x: shadowX,
          y: shadowY,
          opacity: shadowOpacity,
          scale: shadowScale,
          filter: blurFilter,
          transformOrigin: "50% 70%",
        }}
      >
        {text}
      </motion.span>

      <motion.span className={`relative font-extrabold ${className}`} style={{ y: textY }}>
        {text}
      </motion.span>
    </div>
  );
}
