"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import Link from "next/link";
import { ReactNode } from "react";

type NavigationProps = {
  mouseOffset: { x: number; y: number };
};

const NavLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="px-4 py-2 rounded-full transition-colors duration-300 hover:bg-white/10 hover:text-white/90"
  >
    {children}
  </Link>
);

const NavigationContent = () => (
  <div className="flex justify-between w-[324px] text-base font-bold">
    <NavLink href="/career">Career</NavLink>
    <NavLink href="/projects">Projects</NavLink>
    <NavLink href="/education">Education</NavLink>
  </div>
);

export default function Navigation({ mouseOffset }: NavigationProps) {
  return (
    <div className="hidden min-[800px]:block">
      <LiquidGlass
        mouseOffset={mouseOffset}
        padding="8px 14px"
        style={{
          position: "fixed",
          top: "4.7%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        fixedSize={{ width: 352, height: 52 }}
      >
        <NavigationContent />
      </LiquidGlass>
    </div>
  );
}
