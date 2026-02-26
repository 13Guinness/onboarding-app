// Uses OpenRouter with claude-sonnet-4-5 — same model, better pricing
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "anthropic/claude-sonnet-4-5";

export interface AuditResponse {
  domain: string;
  answers: { question: string; answer: string }[];
}

export interface AutomationOpportunity {
  title: string;
  description: string;
  timeSavedPerWeek: number;
  difficulty: "easy" | "medium" | "hard";
  cost: "free" | "low" | "medium" | "high";
  impact: "low" | "medium" | "high" | "transformative";
  tool: string;
  implementationSteps: string[];
}

export interface AuditReport {
  automationMap: Record<string, AutomationOpportunity[]>;
  quickWins: AutomationOpportunity[];
  implementationGuide: {
    week1: string[];
    month1: string[];
    ongoing: string[];
  };
  clientSummary: string;
  estimatedWeeklyTimeSaved: number;
}

export async function generateAuditReport(
  responses: AuditResponse[],
  clientName: string
): Promise<AuditReport> {
  const profileJson = JSON.stringify(responses, null, 2);

  const res = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://onboarding-app-drab.vercel.app",
      "X-Title": "OpenClaw Onboarding Audit",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are an AI automation consultant. Based on the following client profile for ${clientName}, generate a comprehensive AI Life Automation Audit.

CLIENT PROFILE:
${profileJson}

Generate a structured JSON response with:

1. automationMap: For each of the 9 domains, list 3-5 automation opportunities with:
   - title: short name
   - description: what it does
   - timeSavedPerWeek: estimated hours (number)
   - difficulty: "easy" | "medium" | "hard"
   - cost: "free" | "low" | "medium" | "high"
   - impact: "low" | "medium" | "high" | "transformative"
   - tool: recommended tool or approach
   - implementationSteps: string[] (3-5 steps)

2. quickWins: Top 10 automations across all domains ranked by (high impact × low difficulty). Same fields as above.

3. implementationGuide:
   - week1: string[] (3-5 actions to take this week)
   - month1: string[] (things to tackle in month 1)
   - ongoing: string[] (set-and-forget automations)

4. clientSummary: 2-3 sentence personalized summary of their automation potential

5. estimatedWeeklyTimeSaved: total hours/week if they implement all quick wins (number)

Return ONLY valid JSON. No markdown, no explanation, no code fences.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenRouter");

  return JSON.parse(text) as AuditReport;
}
