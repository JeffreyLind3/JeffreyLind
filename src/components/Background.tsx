"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [numImages, setNumImages] = useState(1);

  const updateNumImages = () => {
    const container = containerRef.current;
    if (!container) return;
    const firstImage = imageRef.current || container.querySelector("img");
    if (!firstImage || firstImage.clientHeight === 0) return;
    const imageHeight = firstImage.clientHeight;
    const parent = container.parentElement;
    if (!parent) return;
    const parentHeight = Math.max(parent.clientHeight, window.innerHeight);
    const needed = Math.ceil(parentHeight / imageHeight) + 1;
    setNumImages(needed);
  };

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const resizeObserver = new ResizeObserver(updateNumImages);
    resizeObserver.observe(parent);
    window.addEventListener("resize", updateNumImages);
    updateNumImages();
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateNumImages);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]"
    >
      {Array.from({ length: numImages }, (_, i) => (
        <Image
          key={i}
          ref={i === 0 ? imageRef : null}
          src="/Background.png"
          alt="Background Image"
          className="w-full select-none pointer-events-none"
          width={1600}
          height={500}
          style={
            i % 2 === 1 ? { transform: "rotate(180deg) scaleX(-1)" } : undefined
          }
          draggable={false}
          priority={i === 0}
          loading={i > 0 ? "lazy" : "eager"}
          onLoad={i === 0 ? updateNumImages : undefined}
        />
      ))}
    </div>
  );
};

export default Background;
