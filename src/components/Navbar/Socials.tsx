"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import Image from "next/image";

type SocialsProps = {
  mouseOffset: { x: number; y: number };
};

export default function Socials({ mouseOffset }: SocialsProps) {
  const navHeight = 52;
  const logos = [
    "GitHub Logo.png",
    "LinkedIn Logo.png",
    "X Logo.webp",
    "Threads Logo.png",
  ];

  return (
    <div className="hidden min-[800px]:block">
      <LiquidGlass
        displacementScale={150}
        mouseOffset={mouseOffset}
        padding="0px"
        style={{
          position: "fixed",
          top: "4.7%",
          left: "calc(50% + 220px)",
          transform: "translate(-50%, -50%)",
          width: `${navHeight}px`,
          height: `${navHeight}px`,
        }}
        cornerRadius={navHeight / 2}
        fullSize={true}
        fixedSize={{ width: navHeight, height: navHeight }}
      >
        <div className="grid grid-cols-2 gap-1 w-full h-full p-2.5 items-center justify-items-center">
          {logos.map((logo, index) => (
            <Image
              key={index}
              src={`/Logos/${logo}`}
              alt={logo.replace(".png", "")}
              width={14}
              height={14}
            />
          ))}
        </div>
      </LiquidGlass>
    </div>
  );
}
