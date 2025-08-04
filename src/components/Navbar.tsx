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
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [logoActive, setLogoActive] = useState(false);
  const navHeight = 52;
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
  return (
    <>
      <Link
        ref={logoRef}
        href="/"
        className="fixed top-[4.7%] left-4 -translate-y-1/2 text-2xl font-bold font-sans text-white min-[800px]:left-[calc(50%-281px)] min-[800px]:-translate-x-1/2"
        style={{
          transform: `scale(${logoActive ? 0.96 : 1})`,
          transition: "transform 0.2s ease-out",
        }}
        onMouseLeave={() => setLogoActive(false)}
        onMouseDown={() => setLogoActive(true)}
        onMouseUp={() => setLogoActive(false)}
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
          fixedSize={{ width: 352, height: navHeight }}
        >
          <PillContent />
        </LiquidGlass>
      </div>
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
          fixedSize={{ width: navHeight, height: navHeight }}
        />
      </div>
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
          fixedSize={{ width: navHeight, height: navHeight }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center gap-1.5">
            <div className="w-6 h-0.5 bg-white rounded"></div>
            <div className="w-6 h-0.5 bg-white rounded"></div>
            <div className="w-6 h-0.5 bg-white rounded"></div>
          </div>
        </LiquidGlass>
      </div>
    </>
  );
}
