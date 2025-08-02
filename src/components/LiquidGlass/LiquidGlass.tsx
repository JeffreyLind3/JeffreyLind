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

export const displacementMap =
  "data:image/jpeg;base64,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cUAUAkEkziomgGgkoxZGgxZFQFQlYnQHRdPfj/10KCSCKESCNiVkViPSLpD0h6I0Q0I0A2IoBWBIJIBKBIJoJIJ2R2J0JWBUJ0JUB0XTv479dFZDYiglYigkhEgjZFQjRFQjRFQjQigFYigHYigmgEgmglYlYnQlQlYlQHQlQnQ9P/kf1yVkNiNCNkNiVENiNiViNEViNkVCVgKCViViViSCViSCVgdCViVCViVCdgVCVCdD1D+U/XBWQ2I0I2Q2JUQ2I0JWQ0I2JUQ2JUI2JUI2J0JWJWJWA2R0BWJ0I2JUJ2BUJUJ0P//EABkQAQEBAQEBAAAAAAAAAAAAAAECABEDEP/aAAgBAQABAgB1atWrVq1atWrVq1atWrVq1atWrVq1atWrVq+OrVq1atWrVq1atWrVq1atWrVq1atWrVq1atXxVppppppdWrVq1atWrVq1NNNNNNNNNNNPVWmmmmms6tWrVq1atWpppppppppppppp6q0000uc51atWrVq1ammmmmmmmmmmmmt1Vpppc5znVq1atWrVqaaaaaaaaaaaaaeqtNLnOc51atWrVq1ammmmmmmmmmmmmnqrS5znOc6tWrVq16222mmmmmmlVppp6tKuc5znOrVq1a9TbbbbTTTTTSq000qtLnOc5zq1atWrW0222200000qqqtKqrnOc5zq1atTbbbbbbbbTTTSqqqqqq5znOc6tTTTbbbbbbbbTTTSqqqqrlVznOctNNNtttttttttNNNNKqqqrqznKqrTTTTbbbbbbbbbTTTSqqqqrqznOc5aaaabbbbbbbbbaaaaVVVVVdWc5znVq1NNttttttttttNNKqqqqudWc5znVq16tbbbbbbbbbbTTSqqqq5XVnOc6tWrVrb1tttttttttNNKqqqqrWrK5VWmmm2230bbbbbbaaaXOc5zlVa1KuVVppptttt9G22222mmlzlVznK6tWVVWmmmm2222222222mlznOc5znLWppVVWmmm22222229bTWrOc5znOcq1qaaVpWmm222222229erVqznOc5znKtatStK0rTbTTbbbberXr1as5znOc5aVpppppWlabaabbbb1ta9WrVnOc5znU0rTTTTTTTTTbTTbbbTWvVq1as5znOdTTStNNNNNNNNNtNNtttN6tWvVq1ZznOrU00rTTTTTTTTTTTTTbTWvVq1atWrOc6tTTTStNNNNNNNNNNtNNtNa9WrVq1Z1Z1NNNNNK1q1NNNNNNNNNNNtNatWrVq1atWrU00000rWrVq1atWrVq1alaaa1atWrVq1NNNammmmla1atWrVq1aterVq16tWrVnVqa1NK1qaaaVX/xAAWEAADAAAAAAAAAAAAAAAAAAAhgJD/2gAIAQEAAz8AaExf/8QAGhEBAQEBAQEBAAAAAAAAAAAAAQISEQADEP/aAAgBAgEBAgDx48ePHjx48ePHjx48ePHjx48ePHjx48ePHj86IiIiIiInjx48ePHjx48IiIiIj0oooooooooRERER73ve60UUUUUUVrWiiiiiihERERER73ve97ooooorRWiiiiihKERERER73ve973RRRRWtFFFFFFCIiIiIiPe973ve60UUVrRRRRRRQiIlCIiI973ve973pRRWiiiiiiiiiiiiiiihEe973ve973RRWtFFFFFFFFFFFFFFFFFFa13ve973WitaKKKKKKKKKKKKKKKKKK1rWtd1rutFa1oooooooooooosssooorWta1rWta1rRRRRRRRRRRZZZZZZZZZWta1rWta1rRRRRRRRRZZZZZZZZZZZZe9a1rWta1rWitaKLLLLLLLLLLLLLLLLL3rWta1rWtFbLLLLLLLLLLLLLLLLLLLL3vWta1rWita1ssssssss+hZZZZZZZZe961rWta0Vre97LLLLLLLLLLLPoWWWWWXrWta1oorWta3ssss+hZZZZ9Cyyyyyyyyiita1orWta1ve9llllllllllllllllFFa0VorWta1ve9llllllllllllllllllFFFaK1rWta1rWiyyyyyyyyyyyyiiiiiiitFFa1rWta1oosoosssssoooosoooorRRRWta1rWta0UUUUUWUUUUUUUUUUUVoooorWta1rWtaKKKKKKmiiiiiiiiiiiiiiitd73ve61oSiiipoqaKKKKKKKKKK0UUUVrve973vREREZoSihEooooorRRRRWtd73ve9EREREREoSiiiiitFllllla73ve9ERERERESiiiiiitH0PoWWWWVrXe96IiIiMoiJRRRRRRWjwlFFllllFFd6IiIiIlCUUUUUUUUUePHjx48ePCIiIiIiIiUUUUUUUUUUUePHjx48ePHjx48ePHjx48IiUUUUUUJRRRX//xAAWEQADAAAAAAAAAAAAAAAAAAABYJD/2gAIAQIBAz8AtEV7/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAECEP/aAAgBAwEBAgCtNNNNNNNNNNNNNNNNNNNNNNNNNNNNNcrTTTTTTTTTTTTTTTTTTTTTTTTTTTTTXKrTTTTTTTU000000000000000000001FVpppppqampqaaaaaaaaaaaaaaaaaaaa5Vaaaaampqampqammmmmmmmmmmlaaaaaaiq0001NTU1NTU1NTTTTTTTTTTSqqtNNNcqtNNSyzU1LNTU1NTTTTTTTTTSqqq001ytNLLLLNTU1NTU1NTbbbTTTTTSqqq001ytNLLLLLNTU1NTU3NttttNNNNNKqq001KrSyyyyyzU1NTU3Nzc02220000qqqqrSqqyyyyyzU1NTU3Nzc3NttttNNNKqqqqqqssssss1NTU3Nzc3NzbbbbTTTSqqqqqqrLLLLLNTU1Nzc3Nzc22220000qqqqqqqqssss1NTU3Nzc3NzbbbbbTTSqqqqqqqqqqzU1NTc3Nzc3Nzbc22000qqqqqqqqqqqtTU3Nzc3Nzc3NtzbTTSqqqqrKqqqqqtNNzc23Nzc3Nzc3NTU1KqqqrKqqqqqtNNNNttzc3Nzc3NzU1NLLLLLKqqqqqqqq0022223Nzc3NzU1NSyyyyyyqqqqqqqrTTbbbbc3Nzc3NTU1LLLLLLKsqqqqqqrTTTTbbbc3Nzc1NTUsssssssqqqqqqrTTTTTbbbTc3NTU1NTUsssssqqqqqqqq0000222023NTU1NTUsssssqqqqqqqq000000003NTU1NTU1LLLLLNKrTSqqqqtNNNNNNtNNTU1NSzUssss00qq0qqqqrTTTTTTTTTU1NTUs1LLLNNNKrTTTSqqq00000000001NTU1LNTU0000qtNNNKqqqtNNNNNNNNTU1NTUs1NNNNNKss1NNNK00qtK0000001NNTU0s000000qq000001NKrStNNNNK1NNNNStNNNNNKqtNNNNNNNK0000000rU0000rTTTTTSq00000rTTTTTTTTTTTTTTTTStNNNNKr/xAAUEQEAAAAAAAAAAAAAAAAAAACg/9oACAEDAQM/AAAf/9k=";

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
  width: number;
  height: number;
  mode: "standard" | "shader";
  shaderMapUrl?: string;
}> = ({ id, displacementScale, width, height, mode, shaderMapUrl }) => (
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
          <feFuncA type="discrete" tableValues={`0 0 1`} />
        </feComponentTransfer>

        {/* Original undisplaced image for center */}
        <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

        {/* Red channel displacement */}
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
          scale={displacementScale * (mode === "shader" ? 1 : -1)}
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
          scale={displacementScale * (mode === "shader" ? 1 : -1)}
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

/* ---------- container ---------- */
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
  cornerRadius?: number;
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
  cornerRadius = 999,
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
  const [internalMouseOffset, setInternalMouseOffset] = useState({
    x: 0,
    y: 0,
  });

  // Use external mouse position if provided, otherwise use internal
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
    },
    [mouseContainer]
  );

  // Set up mouse tracking if no external mouse position is provided
  useEffect(() => {
    if (externalMouseOffset) {
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
  }, [handleMouseMove, mouseContainer, externalMouseOffset]);

  // Calculate directional scaling based on mouse position
  const calculateTransform = useCallback(() => {
    const scale = isActive && onClick ? "scale(0.96)" : "scale(1)";
    return `translate(-50%, -50%) ${scale}`;
  }, [isActive, onClick]);

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
        glassSize={glassSize}
        padding={padding}
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
