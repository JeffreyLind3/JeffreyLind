"use client";

import Image from "next/image";
import React from "react";

const Background: React.FC = () => {
  const images = Array.from({ length: 3 }, (_, i) => (
    <Image
      key={i}
      src="/Hero.png"
      alt="Hero background pattern"
      className="w-full select-none pointer-events-none"
      width={1600}
      height={500}
      style={
        i % 2 === 1 ? { transform: "rotate(180deg) scaleX(-1)" } : undefined
      }
      draggable={false}
      priority={i === 0}
    />
  ));

  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none overflow-hidden z-[-1]">
      {images}
    </div>
  );
};

export default Background;
