"use client";

import Background from "@/components/Background";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[calc(100vw_*_25_/_16_*_3_+_200vh)] p-8 pb-20 gap-16 sm:p-20">
      <Background />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"></main>
    </div>
  );
}
