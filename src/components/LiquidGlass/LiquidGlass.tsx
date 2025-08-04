"use client";

import {
  ShaderDisplacementGenerator,
  fragmentShaders,
} from "@/components/LiquidGlass/shader-utils";
import {
  type CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Generate shader-based displacement map using shaderUtils
const generateShaderDisplacementMap = (
  width: number,
  height: number
): string => {
  if (width <= 0 || height <= 0) {
    return "";
  }
  const generator = new ShaderDisplacementGenerator({
    width,
    height,
    fragment: fragmentShaders.liquidGlass,
  });

  const dataUrl = generator.updateShader();
  generator.destroy();

  return dataUrl;
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
        {shaderMapUrl && (
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
        )}

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
    const [shaderMapUrl, setShaderMapUrl] = useState<string>("");

    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    // Generate shader displacement map
    useLayoutEffect(() => {
      const url = generateShaderDisplacementMap(
        glassSize.width,
        glassSize.height
      );
      setShaderMapUrl(url);
    }, [glassSize.width, glassSize.height]);

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
    useLayoutEffect(() => {
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
