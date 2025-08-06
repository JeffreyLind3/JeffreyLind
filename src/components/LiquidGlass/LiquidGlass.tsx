"use client";
import {
  type CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const precomputedMaps: Record<string, string> = {
  "352x52":
    "data:image/png;base64,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",
  "52x52":
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAYVJREFUaEPtWtEOgyAMbHGJv+2HqyxlQpBNqiMhQI6nuULoteWK8XhZFksDDRZA8zzTuq607ztZm+BLnyPwMpP/DEbRWj7vaplpN4Ze20YO0DRNDogAiof8l3O4yKmCYIiPAuLkKzMZ8VcAMfN3ZmSRsqlmzyWvZO0JSPQgEB2gq421TTV7DUAuW8dGwwDyoMYG9IsAtJLS7LVKLuzD/DlDcQ2mB65VlrsKFgA9yWD1kvO0jZI7Qt8cKSBDyaFoN0MHcacUrTms2auTAvpQNyUX3Vaf9JnmSg4sh5K75rmScs2xJy6nT0ijeh8CKYAUQAq5Y3fLBpbrg+Xw+vDJU0m3L1mLm4KPgBZFzY6bwi1izk8CbfdB23gFB21/neQShkQfQh/6o3+g5G4GbczGStY6qUn3Xx+CksR/B0/1Mx1IYwKBic7Hf06RDLkxHKAElMZEmr3W64OXxIUMsejk4uwcvzWHNXsNQLG+LwCaRPxnzE8NWqtKklSoKM/GmLy87Cb1NzXtDV7/iBC32tPvAAAAAElFTkSuQmCC",
};

/* ---------- SVG Filter (Edge-Only Displacement) ---------- */
const GlassFilter: React.FC<{
  id: string;
  displacementScale: number;
  width: number;
  height: number;
  shaderMapUrl: string;
}> = ({ id, displacementScale, width, height, shaderMapUrl }) => (
  <svg style={{ position: "absolute", width, height }} aria-hidden="true">
    <defs>
      <filter
        id={id}
        x="-35%"
        y="-35%"
        width="170%"
        height="170%"
        colorInterpolationFilters="sRGB"
      >
        <feImage
          id="feimage"
          x="0"
          y="0"
          width="100%"
          height="100%"
          result="DISPLACEMENT_MAP"
          href={shaderMapUrl}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Create edge mask using the displacement map itself */}
        <feColorMatrix
          in="DISPLACEMENT_MAP"
          type="matrix"
          values="0.3 0.3 0.3 0 0
                  0.3 0.3 0.3 0 0
                  0.3 0.3 0.3 0 0
                  0 0 0 1 0"
          result="EDGE_INTENSITY"
        />
        <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
          <feFuncA type="discrete" tableValues={`0 0 1`} />
        </feComponentTransfer>

        {/* Original undisplaced image for center */}
        <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

        {/* Red channel displacement */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale}
          xChannelSelector="R"
          yChannelSelector="B"
          result="RED_DISPLACED"
        />
        <feColorMatrix
          in="RED_DISPLACED"
          type="matrix"
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="RED_CHANNEL"
        />

        {/* Green channel displacement */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale}
          xChannelSelector="R"
          yChannelSelector="B"
          result="GREEN_DISPLACED"
        />
        <feColorMatrix
          in="GREEN_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                  0 1 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="GREEN_CHANNEL"
        />

        {/* Blue channel displacement */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale}
          xChannelSelector="R"
          yChannelSelector="B"
          result="BLUE_DISPLACED"
        />
        <feColorMatrix
          in="BLUE_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"
          result="BLUE_CHANNEL"
        />

        {/* Combine all channels with screen blend mode */}
        <feBlend
          in="GREEN_CHANNEL"
          in2="BLUE_CHANNEL"
          mode="screen"
          result="GB_COMBINED"
        />
        <feBlend
          in="RED_CHANNEL"
          in2="GB_COMBINED"
          mode="screen"
          result="RGB_COMBINED"
        />

        {/* Apply edge mask to effect */}
        <feComposite
          in="RGB_COMBINED"
          in2="EDGE_MASK"
          operator="in"
          result="EDGE_EFFECT"
        />

        {/* Create inverted mask for center */}
        <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feComposite
          in="CENTER_ORIGINAL"
          in2="INVERTED_MASK"
          operator="in"
          result="CENTER_CLEAN"
        />

        {/* Combine edge effect with clean center */}
        <feComposite in="EDGE_EFFECT" in2="CENTER_CLEAN" operator="over" />
      </filter>
    </defs>
  </svg>
);

/* ---------- Container ---------- */
const GlassContainer = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
    displacementScale?: number;
    blurAmount?: number;
    saturation?: number;
    onMouseLeave?: () => void;
    onMouseEnter?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
    active?: boolean;
    overLight?: boolean;
    cornerRadius?: number;
    padding?: string;
    glassSize?: { width: number; height: number };
    onClick?: () => void;
    fullSize?: boolean;
  }>
>(
  (
    {
      children,
      className = "",
      style,
      displacementScale = 25,
      blurAmount = 12,
      saturation = 180,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      onMouseMove,
      active = false,
      overLight = false,
      cornerRadius = 999,
      padding = "24px 32px",
      glassSize = { width: 270, height: 69 },
      onClick,
      fullSize = false,
    },
    ref
  ) => {
    const filterId = useId();

    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    const mapKey = `${glassSize.width}x${glassSize.height}`;
    const shaderMapUrl = precomputedMaps[mapKey];
    if (!shaderMapUrl) {
      throw new Error(`No precomputed map for size ${mapKey}`);
    }

    const backdropStyle = {
      filter: isFirefox ? null : `url(#${filterId})`,
      backdropFilter: `blur(${
        (overLight ? 12 : 4) + blurAmount * 32
      }px) saturate(${saturation}%)`,
    };

    return (
      <div
        ref={ref}
        className={`relative ${className} ${active ? "active" : ""} ${
          Boolean(onClick) ? "cursor-pointer" : ""
        }`}
        style={style}
        onClick={onClick}
      >
        <GlassFilter
          id={filterId}
          displacementScale={displacementScale}
          width={glassSize.width}
          height={glassSize.height}
          shaderMapUrl={shaderMapUrl}
        />

        <div
          className="glass"
          style={{
            borderRadius: `${cornerRadius}px`,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: "24px",
            padding,
            overflow: "hidden",
            transition: "all 0.2s ease-in-out",
            boxShadow: overLight
              ? "0px 16px 70px rgba(0, 0, 0, 0.75)"
              : "0px 12px 40px rgba(0, 0, 0, 0.25)",
            ...(fullSize ? { width: "100%", height: "100%" } : {}),
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {/* Backdrop layer that gets wiggly */}
          <span
            className="glass__warp"
            style={
              {
                ...backdropStyle,
                position: "absolute",
                inset: "0",
              } as CSSProperties
            }
          />

          {/* User content stays sharp */}
          <div
            className="transition-all duration-150 ease-in-out text-white"
            style={{
              position: "relative",
              zIndex: 1,
              font: "500 20px/1 system-ui",
              textShadow: overLight
                ? "0px 2px 12px rgba(0, 0, 0, 0)"
                : "0px 2px 12px rgba(0, 0, 0, 0.4)",
              ...(fullSize ? { width: "100%", height: "100%" } : {}),
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

GlassContainer.displayName = "GlassContainer";

interface LiquidGlassProps {
  children?: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  cornerRadius?: number;
  mouseOffset?: { x: number; y: number };
  mouseContainer?: HTMLElement | null;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
  overLight?: boolean;
  onClick?: () => void;
  fullSize?: boolean;
  fixedSize?: { width: number; height: number };
}

const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  (
    {
      children,
      displacementScale = 150,
      blurAmount = 0,
      saturation = 140,
      cornerRadius = 999,
      mouseOffset: externalMouseOffset,
      mouseContainer = null,
      className = "",
      padding = "24px 32px",
      overLight = false,
      style = {},
      onClick,
      fullSize = false,
      fixedSize,
    },
    ref
  ) => {
    const glassRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [glassSize, setGlassSize] = useState(
      fixedSize || { width: 270, height: 69 }
    );
    const [internalMouseOffset, setInternalMouseOffset] = useState({
      x: 0,
      y: 0,
    });

    const [localMouseOffset, setLocalMouseOffset] = useState({ x: 0, y: 0 });
    // Use external mouse position if provided, otherwise use internal
    const mouseOffset = externalMouseOffset || internalMouseOffset;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // Internal mouse tracking
    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        const container = mouseContainer || glassRef.current;
        if (!container) {
          return;
        }

        const referenceRect =
          glassRef.current?.getBoundingClientRect() ||
          container.getBoundingClientRect();
        const centerX = referenceRect.left + referenceRect.width / 2;
        const centerY = referenceRect.top + referenceRect.height / 2;

        setInternalMouseOffset({
          x: Math.max(
            -50,
            Math.min(50, ((e.clientX - centerX) / referenceRect.width) * 100)
          ),
          y: Math.max(
            -50,
            Math.min(50, ((e.clientY - centerY) / referenceRect.height) * 100)
          ),
        });
      },
      [mouseContainer]
    );

    // Set up mouse tracking if no external mouse position is provided
    useEffect(() => {
      if (externalMouseOffset || isSafari) {
        // External mouse tracking is provided or is Safari, don't set up internal tracking
        return;
      }

      const container = mouseContainer || glassRef.current;
      if (!container) {
        return;
      }

      container.addEventListener("mousemove", handleMouseMove);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
      };
    }, [handleMouseMove, mouseContainer, externalMouseOffset, isSafari]);

    // Calculate directional scaling based on mouse position
    const calculateTransform = useCallback(() => {
      const scale = isActive ? "scale(0.96)" : "scale(1)";
      return `translate(-50%, -50%) ${scale}`;
    }, [isActive]);

    // Update glass size on resize if not fixed
    useEffect(() => {
      if (fixedSize) return;
      const current = glassRef.current;
      if (!current) return;
      const updateSize = () => {
        const rect = current.getBoundingClientRect();
        setGlassSize({ width: rect.width, height: rect.height });
      };

      updateSize();
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(current);
      return () => resizeObserver.disconnect();
    }, [fixedSize]);
    const transformStyle = calculateTransform();

    const baseStyle = {
      ...style,
      transform: transformStyle,
      transition: "all ease-out 0.2s",
    };

    const positionStyles = {
      position: baseStyle.position || "relative",
      top: baseStyle.top || "50%",
      left: baseStyle.left || "50%",
    };
    const handleLocalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setLocalMouseOffset({
        x: Math.max(
          -50,
          Math.min(50, ((e.clientX - centerX) / rect.width) * 100)
        ),
        y: Math.max(
          -50,
          Math.min(50, ((e.clientY - centerY) / rect.height) * 100)
        ),
      });
    };
    return (
      <>
        {/* Over light effect */}
        <div
          className={`bg-black transition-all duration-150 ease-in-out pointer-events-none ${
            overLight ? "opacity-20" : "opacity-0"
          }`}
          style={{
            ...positionStyles,
            height: glassSize.height,
            width: glassSize.width,
            borderRadius: `${cornerRadius}px`,
            transform: baseStyle.transform,
            transition: baseStyle.transition,
          }}
        />
        <div
          className={`bg-black transition-all duration-150 ease-in-out pointer-events-none mix-blend-overlay ${
            overLight ? "opacity-100" : "opacity-0"
          }`}
          style={{
            ...positionStyles,
            height: glassSize.height,
            width: glassSize.width,
            borderRadius: `${cornerRadius}px`,
            transform: baseStyle.transform,
            transition: baseStyle.transition,
          }}
        />

        <GlassContainer
          ref={(el) => {
            glassRef.current = el;
            if (ref) {
              if (typeof ref === "function") {
                ref(el);
              } else {
                ref.current = el;
              }
            }
          }}
          className={className}
          style={baseStyle}
          cornerRadius={cornerRadius}
          displacementScale={
            overLight ? displacementScale * 0.5 : displacementScale
          }
          blurAmount={blurAmount}
          saturation={saturation}
          glassSize={glassSize}
          padding={padding}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          onMouseMove={handleLocalMouseMove}
          active={isActive}
          overLight={overLight}
          onClick={onClick}
          fullSize={fullSize}
        >
          {children}
        </GlassContainer>

        {/* Border layer 1 - extracted from glass container */}
        <span
          style={{
            ...positionStyles,
            height: glassSize.height,
            width: glassSize.width,
            borderRadius: `${cornerRadius}px`,
            transform: baseStyle.transform,
            transition: baseStyle.transition,
            pointerEvents: "none",
            mixBlendMode: "screen",
            opacity: 0.2,
            padding: "1.5px",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow:
              "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
            background: `linear-gradient(
                         ${135 + mouseOffset.x * 1.2}deg,
                         rgba(255, 255, 255, 0.0) 0%,
                         rgba(255, 255, 255, ${
                           0.12 + Math.abs(mouseOffset.x) * 0.008
                         }) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%,
                         rgba(255, 255, 255, ${
                           0.4 + Math.abs(mouseOffset.x) * 0.012
                         }) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%,
                         rgba(255, 255, 255, 0.0) 100%
                        )`,
          }}
        />

        {/* Border layer 2 - duplicate with mix-blend-overlay */}
        <span
          style={{
            ...positionStyles,
            height: glassSize.height,
            width: glassSize.width,
            borderRadius: `${cornerRadius}px`,
            transform: baseStyle.transform,
            transition: baseStyle.transition,
            pointerEvents: "none",
            mixBlendMode: "overlay",
            padding: "1.5px",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow:
              "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
            background: `linear-gradient(
                        ${135 + mouseOffset.x * 1.2}deg,
                        rgba(255, 255, 255, 0.0) 0%,
                        rgba(255, 255, 255, ${
                          0.32 + Math.abs(mouseOffset.x) * 0.008
                        }) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%,
                        rgba(255, 255, 255, ${
                          0.6 + Math.abs(mouseOffset.x) * 0.012
                        }) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%,
                        rgba(255, 255, 255, 0.0) 100%
                      )`,
          }}
        />

        {/* Hover effects */}
        <>
          <div
            style={{
              ...positionStyles,
              height: glassSize.height,
              width: glassSize.width + 1,
              borderRadius: `${cornerRadius}px`,
              transform: baseStyle.transform,
              pointerEvents: "none",
              transition: "all 0.2s ease-out",
              opacity: isHovered || isActive ? 0.35 : 0,
              backgroundImage: `radial-gradient(circle at ${
                50 + localMouseOffset.x
              }% ${
                50 + localMouseOffset.y
              }%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)`,
              mixBlendMode: "overlay",
            }}
          />
          <div
            style={{
              ...positionStyles,
              height: glassSize.height,
              width: glassSize.width + 1,
              borderRadius: `${cornerRadius}px`,
              transform: baseStyle.transform,
              pointerEvents: "none",
              transition: "all 0.2s ease-out",
              opacity: isActive ? 0.35 : 0,
              backgroundImage: `radial-gradient(circle at ${
                50 + localMouseOffset.x
              }% ${
                50 + localMouseOffset.y
              }%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)`,
              mixBlendMode: "overlay",
            }}
          />
          <div
            style={{
              ...baseStyle,
              height: glassSize.height,
              width: glassSize.width + 1,
              borderRadius: `${cornerRadius}px`,
              position: baseStyle.position,
              top: baseStyle.top,
              left: baseStyle.left,
              pointerEvents: "none",
              transition: "all 0.2s ease-out",
              opacity: isHovered ? 0.3 : isActive ? 0.6 : 0,
              backgroundImage: `radial-gradient(circle at ${
                50 + localMouseOffset.x
              }% ${
                50 + localMouseOffset.y
              }%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)`,
              mixBlendMode: "overlay",
            }}
          />
        </>
      </>
    );
  }
);

LiquidGlass.displayName = "LiquidGlass";
export default LiquidGlass;
