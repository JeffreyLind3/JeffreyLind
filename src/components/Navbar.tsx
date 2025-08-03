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
      <span
        style={{
          position: "fixed",
          top: "4.7%",
          left: "calc(50% - 335px)",
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
        mouseContainer={container}
        padding="8px 14px"
        style={{
          position: "fixed",
          top: "4.7%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex justify-between w-[432px] text-base font-bold">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/career">Career</NavLink>
          <NavLink href="/education">Education</NavLink>
          <NavLink href="/projects">Projects</NavLink>
        </div>
      </LiquidGlass>
    </>
  );
}
