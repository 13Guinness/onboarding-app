import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import type { AutomationOpportunity } from "@/lib/claude";

const IMPACT_COLORS: Record<string, string> = {
  transformative: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  low: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

function OpportunityCard({ opp, index }: { opp: AutomationOpportunity; index?: number }) {
  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {index !== undefined && (
            <span className="text-2xl font-bold text-zinc-700 w-6">{index + 1}</span>
          )}
          <h3 className="font-semibold text-white">{opp.title}</h3>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${IMPACT_COLORS[opp.impact]}`}>
          {opp.impact}
        </span>
      </div>

      <p className="text-zinc-400 text-sm">{opp.description}</p>

      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
        <span>⏱ {opp.timeSavedPerWeek}h/week</span>
        <span className={DIFFICULTY_COLORS[opp.difficulty]}>● {opp.difficulty}</span>
        <span>💸 {opp.cost}</span>
        <span>🛠 {opp.tool}</span>
      </div>
    </div>
  );
}

const DOMAIN_LABELS: Record<string, string> = {
  professional_work: "Professional Work",
  side_hustles: "Side Hustles & Business",
  finance: "Finance",
  health: "Health & Wellness",
  productivity: "Personal Productivity",
  communication: "Communication",
  home_life: "Home & Life",
  learning: "Learning & Development",
  content_consumption: "Content Consumption",
};

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await prisma.auditReport.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!report || Object.keys(report.automationMap as object).length === 0) {
    notFound();
  }

  const automationMap = report.automationMap as unknown as Record<string, AutomationOpportunity[]>;
  const quickWins = report.quickWins as unknown as AutomationOpportunity[];
  const guide = report.implementationGuide as unknown as {
    week1: string[];
    month1: string[];
    ongoing: string[];
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Header */}
        <div className="space-y-4">
          <p className="text-blue-400 text-sm font-medium uppercase tracking-wider">Your AI Automation Report</p>
          <h1 className="text-4xl font-bold text-white">
            {report.client.name ? `${report.client.name}'s Automation Map` : "Your Automation Map"}
          </h1>
          <p className="text-zinc-400 text-lg">
            Here's where AI can win back your time — ranked by impact.
          </p>
        </div>

        {/* Quick wins */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">⚡ Top 10 Quick Wins</h2>
            <Link
              href={`/api/report/${id}/pdf`}
              className="px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              Download PDF →
            </Link>
          </div>
          <div className="space-y-3">
            {quickWins.map((opp, i) => (
              <OpportunityCard key={i} opp={opp} index={i} />
            ))}
          </div>
        </section>

        {/* Full automation map */}
        <section className="space-y-10">
          <h2 className="text-2xl font-bold text-white">Full Automation Map</h2>
          {Object.entries(automationMap).map(([domain, opps]) => (
            <div key={domain} className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-300 border-b border-zinc-800 pb-2">
                {DOMAIN_LABELS[domain] || domain}
              </h3>
              <div className="space-y-3">
                {opps.map((opp, i) => (
                  <OpportunityCard key={i} opp={opp} />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Implementation guide */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Implementation Guide</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: "This Week", items: guide.week1, color: "border-blue-500/40" },
              { label: "Month 1", items: guide.month1, color: "border-amber-500/40" },
              { label: "Ongoing", items: guide.ongoing, color: "border-green-500/40" },
            ].map(({ label, items, color }) => (
              <div key={label} className={`p-5 rounded-xl bg-zinc-900 border ${color} space-y-3`}>
                <h3 className="font-semibold text-white">{label}</h3>
                <ul className="space-y-2">
                  {items?.map((item, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex gap-2">
                      <span className="text-zinc-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/10 border border-blue-500/20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to implement all of this?</h2>
          <p className="text-zinc-400">
            We can set up your OpenClaw agent with these automations pre-configured — so you start day one already automated.
          </p>
          <a
            href="mailto:matt@fuelvm.com?subject=OpenClaw Setup - Automation Report"
            className="inline-block px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Talk to an Expert →
          </a>
        </section>

      </div>
    </main>
  );
}
