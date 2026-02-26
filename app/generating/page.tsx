"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const STAGES = [
  "Analyzing your professional workflow...",
  "Mapping side hustle opportunities...",
  "Reviewing your financial habits...",
  "Identifying health automation wins...",
  "Optimizing your productivity system...",
  "Scanning communication patterns...",
  "Auditing home & life logistics...",
  "Evaluating learning opportunities...",
  "Processing content consumption habits...",
  "Ranking automations by impact...",
  "Building your implementation guide...",
  "Finalizing your report...",
];

function GeneratingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!reportId) return;

    const poll = setInterval(async () => {
      const res = await fetch(`/api/report/${reportId}/status`);
      if (res.ok) {
        const { ready } = await res.json();
        if (ready) {
          clearInterval(poll);
          router.push(`/report/${reportId}`);
        }
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [reportId, router]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center space-y-10">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
      </div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-2xl font-bold text-white">Building your automation map</h2>
        <p className="text-zinc-400 text-lg transition-all duration-700 min-h-[2rem]">
          {STAGES[stageIndex]}
        </p>
      </div>

      {/* Domain progress bars */}
      <div className="grid grid-cols-3 gap-3 max-w-sm w-full">
        {STAGES.slice(0, 9).map((_, i) => (
          <div key={i} className="h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-1 bg-blue-500 rounded-full transition-all duration-700"
              style={{ width: i < stageIndex ? "100%" : i === stageIndex ? "60%" : "0%" }}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-700">This takes about 30 seconds</p>
    </main>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense>
      <GeneratingContent />
    </Suspense>
  );
}
