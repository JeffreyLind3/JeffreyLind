"use client";

import Background from "@/components/Background";
import LiquidGlass from "liquid-glass-react";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[calc(100vw_*_25_/_16_*_3_+_200vh)] p-8 pb-20 gap-16 sm:p-20"
    >
      <Background />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <LiquidGlass
          displacementScale={100}
          blurAmount={0}
          saturation={100}
          aberrationIntensity={3}
          elasticity={0.3}
          cornerRadius={100}
          mouseContainer={containerRef}
          style={{
            position: "fixed",
            top: "6%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="p-6 w-[400px]" />
        </LiquidGlass>
      </main>
    </div>
  );
}
