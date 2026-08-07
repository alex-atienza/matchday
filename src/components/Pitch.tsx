/* Skeuomorphic floodlit-grass pitch — the "Under the Lights" field grain.
   Grass fills the container; pass `lines` for portrait field markings, and
   overlay dots / trails as children. */
import { useId } from "react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  lines?: boolean;
  radius?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export default function Pitch({ lines, radius = 16, className, style, children }: Props) {
  const raw = useId().replace(/[:]/g, "");
  const turf = `turf-${raw}`;
  const fine = `fine-${raw}`;
  const mot = `mot-${raw}`;
  const flood = `flood-${raw}`;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: radius,
        ...style,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id={turf} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#317a4b" />
            <stop offset="0.5" stopColor="#256237" />
            <stop offset="1" stopColor="#193f25" />
          </linearGradient>
          <filter id={fine} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
            <feColorMatrix type="luminanceToAlpha" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.13" />
            </feComponentTransfer>
          </filter>
          <filter id={mot} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.025 0.06" numOctaves="3" seed="4" stitchTiles="stitch" />
            <feColorMatrix type="luminanceToAlpha" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.09" />
            </feComponentTransfer>
          </filter>
          <radialGradient id={flood} cx="50%" cy="24%" r="82%">
            <stop offset="0" stopColor="#fbffe9" stopOpacity="0.17" />
            <stop offset="0.45" stopColor="#e6ffee" stopOpacity="0.04" />
            <stop offset="1" stopColor="#03130a" stopOpacity="0.44" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${turf})`} />
        <g>
          <rect y="0" width="100" height="20" fill="#ffffff" opacity="0.055" />
          <rect y="20" width="100" height="20" fill="#04160c" opacity="0.1" />
          <rect y="40" width="100" height="20" fill="#ffffff" opacity="0.055" />
          <rect y="60" width="100" height="20" fill="#04160c" opacity="0.1" />
          <rect y="80" width="100" height="20" fill="#ffffff" opacity="0.055" />
        </g>
        <rect width="100" height="100" fill="none" filter={`url(#${mot})`} />
        <rect width="100" height="100" fill="none" filter={`url(#${fine})`} />
        <rect width="100" height="100" fill={`url(#${flood})`} />
      </svg>

      {lines && (
        <svg
          viewBox="0 0 100 150"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          stroke="#ffffff"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        >
          <rect x="6" y="6" width="88" height="138" />
          <line x1="6" y1="75" x2="94" y2="75" />
          <circle cx="50" cy="75" r="16" />
          <circle cx="50" cy="75" r="1" fill="#ffffff" stroke="none" />
          <rect x="28" y="6" width="44" height="20" />
          <rect x="28" y="124" width="44" height="20" />
        </svg>
      )}

      {children}
    </div>
  );
}
