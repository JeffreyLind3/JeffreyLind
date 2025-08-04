"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="px-4 py-2 rounded-full transition-colors duration-300 hover:bg-white/10 hover:text-white/90"
  >
    {children}
  </Link>
);

const PillContent = () => (
  <div className="flex justify-between w-[324px] text-base font-bold">
    <NavLink href="/education">Education</NavLink>
    <NavLink href="/career">Career</NavLink>
    <NavLink href="/projects">Projects</NavLink>
  </div>
);

export default function Navbar() {
  const [globalMouseOffset, setGlobalMouseOffset] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = ((e.clientX - centerX) / (window.innerWidth / 2)) * 50;
      const offsetY = ((e.clientY - centerY) / (window.innerHeight / 2)) * 50;
      setGlobalMouseOffset({
        x: Math.max(-50, Math.min(50, offsetX)),
        y: Math.max(-50, Math.min(50, offsetY)),
      });
    };
    document.addEventListener("mousemove", handleGlobalMouseMove);
    return () =>
      document.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.getBoundingClientRect().height);
    }
  }, []);
  return (
    <>
      <div className="absolute -top-[9999px] pointer-events-none">
        <LiquidGlass
          ref={navRef}
          mouseOffset={globalMouseOffset}
          padding="8px 14px"
        >
          <PillContent />
        </LiquidGlass>
      </div>
      <Link
        href="/"
        className="fixed top-[4.7%] left-4 -translate-y-1/2 text-2xl font-bold font-sans text-white min-[800px]:left-[calc(50%-281px)] min-[800px]:-translate-x-1/2"
      >
        Jeffrey Lind
      </Link>
      <div className="hidden min-[800px]:block">
        <LiquidGlass
          mouseOffset={globalMouseOffset}
          padding="8px 14px"
          style={{
            position: "fixed",
            top: "4.7%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <PillContent />
        </LiquidGlass>
      </div>
      {navHeight > 0 && (
        <div className="hidden min-[800px]:block">
          <LiquidGlass
            displacementScale={150}
            mouseOffset={globalMouseOffset}
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
          />
        </div>
      )}
      {navHeight > 0 && (
        <div className="block min-[800px]:hidden">
          <LiquidGlass
            displacementScale={150}
            mouseOffset={globalMouseOffset}
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
          />
        </div>
      )}
    </>
  );
}
