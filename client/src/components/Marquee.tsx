import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
  style?: CSSProperties;
};

export default function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  gap = 48,
  className,
  style,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (!trackRef.current) return;
    const ro = new ResizeObserver(() => {
      if (trackRef.current) setTrackWidth(trackRef.current.scrollWidth / 2);
    });
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [children]);

  const duration = trackWidth > 0 ? trackWidth / speed : 30;

  return (
    <div
      className={className}
      style={{ overflow: "hidden", width: "100%", ...style }}
    >
      <div
        ref={trackRef}
        style={
          {
            display: "flex",
            gap: `${gap}px`,
            width: "max-content",
            alignItems: "center",
            animation: `marquee ${duration}s linear infinite`,
            ["--marquee-play-state" as string]: pauseOnHover ? undefined : "running",
          } as CSSProperties
        }
        onMouseEnter={(e) => {
          if (pauseOnHover) (e.currentTarget as HTMLElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) (e.currentTarget as HTMLElement).style.animationPlayState = "running";
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
