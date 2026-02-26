import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      {/* Hero */}
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Free AI Automation Audit
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
          Discover Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            AI Automation
          </span>{" "}
          Potential
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Answer 9 short domains of questions. Get a personalized map of your top
          automation opportunities — ranked by impact, difficulty, and time saved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/audit"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-colors"
          >
            Start Your Free Audit →
          </Link>
          <p className="text-sm text-zinc-500">Takes ~10 minutes · No credit card</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-24 grid grid-cols-3 gap-12 max-w-2xl w-full text-center">
        {[
          { value: "9", label: "Life domains covered" },
          { value: "10+", label: "Quick wins identified" },
          { value: "~5h", label: "Avg. time saved per week" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-4xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-20 text-xs text-zinc-700">
        By invitation only · Powered by Claude AI
      </p>
    </main>
  );
}
