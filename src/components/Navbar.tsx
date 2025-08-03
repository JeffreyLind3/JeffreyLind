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
    <>
      <span
        style={{
          position: "fixed",
          top: "4.7%",
          left: "calc(50% - 285px)",
          transform: "translate(-50%, -50%)",
          fontSize: "1.5rem",
          fontWeight: "bold",
          fontFamily: "var(--font-geist-sans)",
          color: "white",
        }}
      >
        Jeffrey Lind
      </span>
      <LiquidGlass
        displacementScale={150}
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
          <Link href="/">Home</Link>
          <Link href="/career">Career</Link>
          <Link href="/projects">Projects</Link>
        </div>
      </LiquidGlass>
    </>
  );
}
