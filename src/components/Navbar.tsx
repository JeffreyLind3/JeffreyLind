"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import Link from "next/link";
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
      padding="16px 30px"
      style={{
        position: "fixed",
        top: "4.7%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="flex justify-between w-[300px] text-base font-bold">
        <Link href="#">Home</Link>
        <Link href="#">Career</Link>
        <Link href="#">Projects</Link>
      </div>
    </LiquidGlass>
  );
}
