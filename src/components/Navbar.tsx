"use client";

import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function Navbar() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(document.body);
  }, []);

  return (
    <>
      <Link
        href="/"
        className="fixed top-[4.7%] left-4 -translate-y-1/2 text-2xl font-bold font-sans text-white min-[800px]:left-[calc(50%-281px)] min-[800px]:-translate-x-1/2"
      >
        Jeffrey Lind
      </Link>
      <div className="hidden min-[800px]:block">
        <LiquidGlass
          mouseContainer={container}
          padding="8px 14px"
          style={{
            position: "fixed",
            top: "4.7%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="flex justify-between w-[324px] text-base font-bold">
            <NavLink href="/career">Career</NavLink>
            <NavLink href="/education">Education</NavLink>
            <NavLink href="/projects">Projects</NavLink>
          </div>
        </LiquidGlass>
      </div>
    </>
  );
}
