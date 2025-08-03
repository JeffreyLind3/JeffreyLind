"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import { useEffect, useRef } from "react";

export default function Navbar() {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    containerRef.current = document.body;
  }, []);

  return (
    <LiquidGlass
      displacementScale={100}
      mouseContainer={containerRef}
      style={{
        position: "fixed",
        top: "5%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="p-1 w-[400px]" />
    </LiquidGlass>
  );
}
