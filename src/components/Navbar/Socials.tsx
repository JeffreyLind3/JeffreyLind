"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";

type SocialsProps = {
  mouseOffset: { x: number; y: number };
};

export default function Socials({ mouseOffset }: SocialsProps) {
  const navHeight = 52;
  const anchorLeft = "calc(50% + 220px)";
  const anchorTop = "4.7%";

  // Empty dropdown size + placement (rounded rectangle)
  const dropdownWidth = 228;
  const dropdownHeight = 160;
  // Circle half-height (26) + small gap (8) + half dropdown
  const dropdownOffsetFromAnchor = 26 + 8 + dropdownHeight / 2;

  const logos = [
    "GitHub Logo.png",
    "LinkedIn Logo.png",
    "X Logo.webp",
    "Threads Logo.png",
  ];

  // Hover state with small close delay to bridge the gap
  const [buttonHovered, setButtonHovered] = useState(false);
  const [dropdownHovered, setDropdownHovered] = useState(false);

  // Separate timers so they don't cancel each other
  const buttonTimer = useRef<number | null>(null);
  const dropdownTimer = useRef<number | null>(null);

  const clearTimer = (ref: RefObject<number | null>) => {
    if (ref.current !== null) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearTimer(buttonTimer);
      clearTimer(dropdownTimer);
    };
  }, []);

  const isOpen = buttonHovered || dropdownHovered;

  return (
    <div className="hidden min-[800px]:block">
      {/* Socials circle */}
      <div
        onMouseEnter={() => {
          clearTimer(buttonTimer);
          setButtonHovered(true);
        }}
        onMouseLeave={() => {
          clearTimer(buttonTimer);
          buttonTimer.current = window.setTimeout(
            () => setButtonHovered(false),
            130
          );
        }}
        aria-label="Open socials menu"
      >
        <LiquidGlass
          displacementScale={150}
          mouseOffset={mouseOffset}
          padding="0px"
          style={{
            position: "fixed",
            top: anchorTop,
            left: anchorLeft,
            transform: "translate(-50%, -50%)",
            width: `${navHeight}px`,
            height: `${navHeight}px`,
          }}
          cornerRadius={navHeight / 2}
          fullSize
          fixedSize={{ width: navHeight, height: navHeight }}
        >
          <div className="grid grid-cols-2 gap-1 w-full h-full p-2.5 items-center justify-items-center">
            {logos.map((logo, index) => (
              <Image
                key={index}
                src={`/Logos/${logo}`}
                alt={logo.replace(/\.(png|webp)$/i, "")}
                width={14}
                height={14}
              />
            ))}
          </div>
        </LiquidGlass>
      </div>

      {isOpen && (
        <div
          onMouseEnter={() => {
            clearTimer(dropdownTimer);
            setDropdownHovered(true);
          }}
          onMouseLeave={() => {
            clearTimer(dropdownTimer);
            dropdownTimer.current = window.setTimeout(
              () => setDropdownHovered(false),
              130
            );
          }}
        >
          <LiquidGlass
            mouseOffset={mouseOffset}
            padding="0px"
            style={{
              position: "fixed",
              top: `calc(${anchorTop} + ${dropdownOffsetFromAnchor}px)`,
              left: anchorLeft,
              transform: "translate(-50%, -50%)",
              width: `${dropdownWidth}px`,
              height: `${dropdownHeight}px`,
            }}
            cornerRadius={48}
            fullSize
            fixedSize={{ width: dropdownWidth, height: dropdownHeight }}
          >
            <div className="w-full h-full" aria-hidden />
          </LiquidGlass>
        </div>
      )}
    </div>
  );
}
