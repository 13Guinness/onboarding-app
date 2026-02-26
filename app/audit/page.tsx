"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DOMAINS } from "@/lib/audit-questions";

type Answers = Record<string, Record<string, string | string[]>>;

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0-8 = domains, 9 = contact info
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("audit_answers");
    const savedContact = localStorage.getItem("audit_contact");
    const savedStep = localStorage.getItem("audit_step");
    if (saved) setAnswers(JSON.parse(saved));
    if (savedContact) setContact(JSON.parse(savedContact));
    if (savedStep) setStep(parseInt(savedStep));
  }, []);

  function saveProgress(newAnswers: Answers, newStep: number) {
    localStorage.setItem("audit_answers", JSON.stringify(newAnswers));
    localStorage.setItem("audit_step", String(newStep));
  }

  function handleAnswer(questionId: string, value: string | string[]) {
    const domain = DOMAINS[step];
    const updated = {
      ...answers,
      [domain.id]: { ...(answers[domain.id] || {}), [questionId]: value },
    };
    setAnswers(updated);
    saveProgress(updated, step);
  }

  function handleMultiselect(questionId: string, option: string) {
    const domain = DOMAINS[step];
    const current = (answers[domain.id]?.[questionId] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    handleAnswer(questionId, updated);
  }

  function nextStep() {
    const newStep = step + 1;
    setStep(newStep);
    saveProgress(answers, newStep);
    window.scrollTo(0, 0);
  }

  function prevStep() {
    const newStep = step - 1;
    setStep(newStep);
    saveProgress(answers, newStep);
    window.scrollTo(0, 0);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    localStorage.setItem("audit_contact", JSON.stringify(contact));

    const responses = DOMAINS.map((domain) => ({
      domain: domain.id,
      answers: domain.questions.map((q) => ({
        question: q.label,
        answer: answers[domain.id]?.[q.id] || "",
      })),
    }));

    const res = await fetch("/api/audit/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: contact.name, email: contact.email, responses }),
    });

    if (res.ok) {
      const { reportId } = await res.json();
      localStorage.removeItem("audit_answers");
      localStorage.removeItem("audit_contact");
      localStorage.removeItem("audit_step");
      router.push(`/generating?id=${reportId}`);
    } else {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  const isLastDomain = step === DOMAINS.length - 1;
  const isContactStep = step === DOMAINS.length;
  const totalSteps = DOMAINS.length + 1;
  const progress = ((step + 1) / totalSteps) * 100;

  if (isContactStep) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full space-y-8">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Almost done</span>
              <span>{totalSteps}/{totalSteps}</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full">
              <div className="h-1 bg-blue-500 rounded-full transition-all duration-500" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Where should we send your report?</h2>
            <p className="text-zinc-400">We'll generate your personalized automation map and email you a copy.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">Your name</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="First name"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">Email address</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!contact.name || !contact.email || isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
            >
              {isSubmitting ? "Generating your report..." : "Generate My Automation Map →"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const domain = DOMAINS[step];
  const domainAnswers = answers[domain.id] || {};

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full space-y-8">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Domain {step + 1} of {DOMAINS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full">
            <div className="h-1 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Domain header */}
        <div className="space-y-1">
          <p className="text-blue-400 text-sm font-medium uppercase tracking-wider">{domain.title}</p>
          <h2 className="text-3xl font-bold text-white">{domain.description}</h2>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {domain.questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="text-zinc-300 font-medium">{q.label}</label>

              {q.type === "text" && (
                <input
                  type="text"
                  value={(domainAnswers[q.id] as string) || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              )}

              {q.type === "textarea" && (
                <textarea
                  value={(domainAnswers[q.id] as string) || ""}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              )}

              {q.type === "multiselect" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = ((domainAnswers[q.id] as string[]) || []).includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => handleMultiselect(q.id, opt)}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                          selected
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-2">
          {step > 0 && (
            <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors">
              ← Back
            </button>
          )}
          <button
            onClick={isLastDomain ? nextStep : nextStep}
            className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            {isLastDomain ? "Last step →" : "Continue →"}
          </button>
        </div>
      </div>
    </main>
  );
}
