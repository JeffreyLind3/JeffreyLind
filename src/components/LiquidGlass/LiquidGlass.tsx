import { displacementMap } from "@/components/LiquidGlass/displacementMap";
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
  useRef,
  useState,
} from "react";

// Generate shader-based displacement map using shaderUtils
const generateShaderDisplacementMap = (
  width: number,
  height: number
): string => {
  const generator = new ShaderDisplacementGenerator({
    width,
    height,
    fragment: fragmentShaders.liquidGlass,
  });

  const dataUrl = generator.updateShader();
  generator.destroy();

  return dataUrl;
};

const getMap = (mode: "standard" | "shader", shaderMapUrl?: string) => {
  switch (mode) {
    case "standard":
      return displacementMap;
    case "shader":
      return shaderMapUrl || displacementMap;
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};

/* ---------- SVG filter (edge-only displacement) ---------- */
const GlassFilter: React.FC<{
  id: string;
  displacementScale: number;
  aberrationIntensity: number;
  width: number;
  height: number;
  mode: "standard" | "shader";
  shaderMapUrl?: string;
}> = ({
  id,
  displacementScale,
  aberrationIntensity,
  width,
  height,
  mode,
  shaderMapUrl,
}) => (
  <svg style={{ position: "absolute", width, height }} aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-edge-mask`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="black" stopOpacity="0" />
        <stop
          offset={`${Math.max(30, 80 - aberrationIntensity * 2)}%`}
          stopColor="black"
          stopOpacity="0"
        />
        <stop offset="100%" stopColor="white" stopOpacity="1" />
      </radialGradient>
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
          href={getMap(mode, shaderMapUrl)}
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
          <feFuncA
            type="discrete"
            tableValues={`0 ${aberrationIntensity * 0.05} 1`}
          />
        </feComponentTransfer>

        {/* Original undisplaced image for center */}
        <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

        {/* Red channel displacement with slight offset */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale * (mode === "shader" ? 1 : -1)}
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
          scale={
            displacementScale *
            ((mode === "shader" ? 1 : -1) - aberrationIntensity * 0.05)
          }
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

        {/* Blue channel displacement with slight offset */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={
            displacementScale *
            ((mode === "shader" ? 1 : -1) - aberrationIntensity * 0.1)
          }
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

        {/* Combine all channels with screen blend mode for chromatic aberration */}
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

        {/* Add slight blur to soften the aberration effect */}
        <feGaussianBlur
          in="RGB_COMBINED"
          stdDeviation={Math.max(0.1, 0.5 - aberrationIntensity * 0.1)}
          result="ABERRATED_BLURRED"
        />

        {/* Apply edge mask to aberration effect */}
        <feComposite
          in="ABERRATED_BLURRED"
          in2="EDGE_MASK"
          operator="in"
          result="EDGE_ABERRATION"
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

        {/* Combine edge aberration with clean center */}
        <feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
      </filter>
    </defs>
  </svg>
);

/* ---------- container ---------- */
const GlassContainer = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
    displacementScale?: number;
    blurAmount?: number;
    saturation?: number;
    aberrationIntensity?: number;
    mouseOffset?: { x: number; y: number };
    onMouseLeave?: () => void;
    onMouseEnter?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    active?: boolean;
    overLight?: boolean;
    cornerRadius?: number;
    padding?: string;
    glassSize?: { width: number; height: number };
    onClick?: () => void;
    mode?: "standard" | "shader";
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
      aberrationIntensity = 2,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      active = false,
      overLight = false,
      cornerRadius = 999,
      padding = "24px 32px",
      glassSize = { width: 270, height: 69 },
      onClick,
      mode = "standard",
    },
    ref
  ) => {
    const filterId = useId();
    const [shaderMapUrl, setShaderMapUrl] = useState<string>("");

    const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

    // Generate shader displacement map when in shader mode
    useEffect(() => {
      if (mode === "shader") {
        const url = generateShaderDisplacementMap(
          glassSize.width,
          glassSize.height
        );
        setShaderMapUrl(url);
      }
    }, [mode, glassSize.width, glassSize.height]);

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
          mode={mode}
          id={filterId}
          displacementScale={displacementScale}
          aberrationIntensity={aberrationIntensity}
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
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        >
          {/* backdrop layer that gets wiggly */}
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

          {/* user content stays sharp */}
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
  children: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  globalMousePos?: { x: number; y: number };
  mouseOffset?: { x: number; y: number };
  mouseContainer?: React.RefObject<HTMLElement | null> | null;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
  overLight?: boolean;
  mode?: "standard" | "shader";
  onClick?: () => void;
}

export default function LiquidGlass({
  children,
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 999,
  globalMousePos: externalGlobalMousePos,
  mouseOffset: externalMouseOffset,
  mouseContainer = null,
  className = "",
  padding = "24px 32px",
  overLight = false,
  style = {},
  mode = "standard",
  onClick,
}: LiquidGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [glassSize, setGlassSize] = useState({ width: 270, height: 69 });
  const [internalGlobalMousePos, setInternalGlobalMousePos] = useState({
    x: 0,
    y: 0,
  });
  const [internalMouseOffset, setInternalMouseOffset] = useState({
    x: 0,
    y: 0,
  });

  // Use external mouse position if provided, otherwise use internal
  const globalMousePos = externalGlobalMousePos || internalGlobalMousePos;
  const mouseOffset = externalMouseOffset || internalMouseOffset;

  // Internal mouse tracking
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = mouseContainer?.current || glassRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setInternalMouseOffset({
        x: ((e.clientX - centerX) / rect.width) * 100,
        y: ((e.clientY - centerY) / rect.height) * 100,
      });

      setInternalGlobalMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    },
    [mouseContainer]
  );

  // Set up mouse tracking if no external mouse position is provided
  useEffect(() => {
    if (externalGlobalMousePos && externalMouseOffset) {
      // External mouse tracking is provided, don't set up internal tracking
      return;
    }

    const container = mouseContainer?.current || glassRef.current;
    if (!container) {
      return;
    }

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    handleMouseMove,
    mouseContainer,
    externalGlobalMousePos,
    externalMouseOffset,
  ]);

  // Calculate directional scaling based on mouse position
  const calculateTransform = useCallback(() => {
    if (!globalMousePos.x || !globalMousePos.y || !glassRef.current) {
      return "translate(-50%, -50%) scale(1)";
    }

    const rect = glassRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = globalMousePos.x - centerX;
    const deltaY = globalMousePos.y - centerY;

    // Fade-in calculation
    const edgeX = Math.max(0, Math.abs(deltaX) - glassSize.width / 2);
    const edgeY = Math.max(0, Math.abs(deltaY) - glassSize.height / 2);
    const edgeDist = Math.sqrt(edgeX ** 2 + edgeY ** 2);
    const fadeIn = edgeDist > 200 ? 0 : 1 - edgeDist / 200;

    // Translation
    const transX = deltaX * elasticity * 0.1 * fadeIn;
    const transY = deltaY * elasticity * 0.1 * fadeIn;

    const centerDist = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    if (centerDist === 0 || edgeDist > 200) {
      return `translate(calc(-50% + ${transX}px), calc(-50% + ${transY}px)) scale(1)`;
    }

    // Scaling
    const normX = deltaX / centerDist;
    const normY = deltaY / centerDist;
    const intensity = Math.min(centerDist / 300, 1) * elasticity * fadeIn;
    const scaleX = Math.max(
      0.8,
      1 + Math.abs(normX) * intensity * 0.3 - Math.abs(normY) * intensity * 0.15
    );
    const scaleY = Math.max(
      0.8,
      1 + Math.abs(normY) * intensity * 0.3 - Math.abs(normX) * intensity * 0.15
    );

    const scale =
      isActive && onClick
        ? "scale(0.96)"
        : `scaleX(${scaleX}) scaleY(${scaleY})`;
    return `translate(calc(-50% + ${transX}px), calc(-50% + ${transY}px)) ${scale}`;
  }, [globalMousePos, elasticity, glassSize, isActive, onClick]);

  // Update glass size whenever component mounts or window resizes
  useEffect(() => {
    const updateGlassSize = () => {
      if (glassRef.current) {
        const rect = glassRef.current.getBoundingClientRect();
        setGlassSize({ width: rect.width, height: rect.height });
      }
    };

    updateGlassSize();
    window.addEventListener("resize", updateGlassSize);
    return () => window.removeEventListener("resize", updateGlassSize);
  }, []);

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
        ref={glassRef}
        className={className}
        style={baseStyle}
        cornerRadius={cornerRadius}
        displacementScale={
          overLight ? displacementScale * 0.5 : displacementScale
        }
        blurAmount={blurAmount}
        saturation={saturation}
        aberrationIntensity={aberrationIntensity}
        glassSize={glassSize}
        padding={padding}
        mouseOffset={mouseOffset}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        active={isActive}
        overLight={overLight}
        onClick={onClick}
        mode={mode}
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
      {Boolean(onClick) && (
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
              opacity: isHovered || isActive ? 0.5 : 0,
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)",
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
              opacity: isActive ? 0.5 : 0,
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)",
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
              opacity: isHovered ? 0.4 : isActive ? 0.8 : 0,
              backgroundImage:
                "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
              mixBlendMode: "overlay",
            }}
          />
        </>
      )}
    </>
  );
}
