"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export default function Wordmark() {
  const [logoActive, setLogoActive] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);

  return (
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
  );
}
