"use client";

import Hamburger from "@/components/Navbar/Hamburger";
import Navigation from "@/components/Navbar/Navigation";
import Socials from "@/components/Navbar/Socials";
import Wordmark from "@/components/Navbar/Wordmark";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [globalMouseOffset, setGlobalMouseOffset] = useState({ x: 0, y: 0 });

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
      <Wordmark />
      <Navigation mouseOffset={globalMouseOffset} />
      <Socials mouseOffset={globalMouseOffset} />
      <Hamburger mouseOffset={globalMouseOffset} />
    </>
  );
}
