import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
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
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return JSON.parse(content.text) as AuditReport;
}
