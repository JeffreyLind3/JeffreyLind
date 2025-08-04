"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";

type HamburgerProps = {
  mouseOffset: { x: number; y: number };
};

export default function Hamburger({ mouseOffset }: HamburgerProps) {
  const navHeight = 52;

  return (
    <div className="block min-[800px]:hidden">
      <LiquidGlass
        displacementScale={150}
        mouseOffset={mouseOffset}
        padding="0px"
        style={{
          position: "fixed",
          top: "4.7%",
          left: `calc(100% - 1rem - ${navHeight / 2}px)`,
          transform: "translate(-50%, -50%)",
          width: `${navHeight}px`,
          height: `${navHeight}px`,
        }}
        cornerRadius={navHeight / 2}
        fullSize={true}
        fixedSize={{ width: navHeight, height: navHeight }}
      >
        <div className="w-full h-full flex flex-col justify-center items-center gap-1.5">
          <div className="w-6 h-0.5 bg-white rounded"></div>
          <div className="w-6 h-0.5 bg-white rounded"></div>
          <div className="w-6 h-0.5 bg-white rounded"></div>
        </div>
      </LiquidGlass>
    </div>
  );
}
