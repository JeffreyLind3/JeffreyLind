"use client";

import Background from "@/components/Background";

export default function Education() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-[100vh] p-8 pb-20 gap-16 sm:p-20">
      <Background />
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-5xl font-bold">Education</h1>
      </main>
    </div>
  );
}
