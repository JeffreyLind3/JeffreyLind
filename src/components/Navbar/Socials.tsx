"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";

type SocialsProps = {
  mouseOffset: { x: number; y: number };
};

export default function Socials({ mouseOffset }: SocialsProps) {
  const navHeight = 52;

  return (
    <div className="hidden min-[800px]:block">
      <LiquidGlass
        displacementScale={150}
        mouseOffset={mouseOffset}
        padding="0px"
        style={{
          position: "fixed",
          top: "4.7%",
          left: "calc(50% + 240px)",
          transform: "translate(-50%, -50%)",
          width: `${navHeight}px`,
          height: `${navHeight}px`,
        }}
        cornerRadius={navHeight / 2}
        fullSize={true}
        fixedSize={{ width: navHeight, height: navHeight }}
      />
    </div>
  );
}
