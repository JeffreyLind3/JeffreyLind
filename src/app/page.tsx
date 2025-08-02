"use client";

import LiquidGlass from "liquid-glass-react";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[calc(100vw_*_25_/_16_+_200vh)] p-8 pb-20 gap-16 sm:p-20 bg-[url('/Hero.png'),_url('/Hero.png'),_url('/Hero.png'),_url('/Hero.png'),_url('/Hero.png')] bg-[size:100%_auto,100%_auto,100%_auto,100%_auto,100%_auto] bg-[position:0_0,0_calc(100vw_*_5_/_16),0_calc(100vw_*_10_/_16),0_calc(100vw_*_15_/_16),0_calc(100vw_*_20_/_16)] bg-[repeat:no-repeat,no-repeat,no-repeat,no-repeat,no-repeat]"
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <LiquidGlass
          displacementScale={100}
          blurAmount={0}
          saturation={100}
          aberrationIntensity={3}
          elasticity={0.3}
          cornerRadius={32}
          mouseContainer={containerRef}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="p-6 w-[400px] h-[200px]" />
        </LiquidGlass>
      </main>
    </div>
  );
}
