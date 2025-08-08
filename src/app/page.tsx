"use client";

import Background from "@/components/Background";
import SplineViewer from "@/components/SplineViewer";
import Script from "next/script";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-[100vh] p-8 pb-20 gap-16 sm:p-20">
      <Background />
      <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center w-full min-h-[70vh]">
        <Script
          src="https://unpkg.com/@splinetool/viewer@1.10.44/build/spline-viewer.js"
          type="module"
          strategy="afterInteractive"
        />
        <div className="w-full aspect-[16/9] mx-auto max-w-[720px] sm:max-w-[840px] md:max-w-[960px] lg:max-w-[1080px]">
          <SplineViewer url="https://prod.spline.design/DdEgaMohFrnSBxDF/scene.splinecode" />
        </div>
      </main>
    </div>
  );
}
