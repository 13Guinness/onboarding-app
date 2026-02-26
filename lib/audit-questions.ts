export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "multiselect";
  options?: string[];
  placeholder?: string;
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const DOMAINS: Domain[] = [
  {
    id: "professional_work",
    title: "Professional Work",
    description: "Your day job — what takes the most time?",
    questions: [
      { id: "role", label: "What's your role / job title?", type: "text", placeholder: "e.g. Marketing Manager, Freelance Designer" },
      { id: "tools", label: "What tools do you use daily?", type: "textarea", placeholder: "e.g. Slack, HubSpot, Google Docs, Notion..." },
      { id: "time_sink", label: "What's your biggest time sink at work?", type: "textarea", placeholder: "e.g. Writing reports, responding to emails, scheduling meetings..." },
      { id: "repetitive", label: "What's the most repetitive task you do?", type: "textarea", placeholder: "e.g. Copy-pasting data between tools, sending status updates..." },
    ],
  },
  {
    id: "side_hustles",
    title: "Side Hustles & Business",
    description: "Projects outside your day job",
    questions: [
      { id: "projects", label: "Do you have any side projects or businesses?", type: "textarea", placeholder: "e.g. Freelance writing, Etsy shop, consulting..." },
      { id: "revenue", label: "What are your revenue streams?", type: "textarea", placeholder: "e.g. Client retainers, product sales, ad revenue..." },
      { id: "bottleneck", label: "What's the biggest bottleneck in your side work?", type: "textarea", placeholder: "e.g. Finding clients, fulfillment, invoicing..." },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    description: "How you manage money",
    questions: [
      { id: "tracking", label: "How do you track spending and finances?", type: "text", placeholder: "e.g. Spreadsheet, YNAB, Mint, nothing..." },
      { id: "pain_points", label: "What financial tasks feel manual or painful?", type: "textarea", placeholder: "e.g. Categorizing transactions, tracking subscriptions, tax prep..." },
      { id: "goals", label: "Any financial goals you're working toward?", type: "textarea", placeholder: "e.g. Emergency fund, investing, paying off debt..." },
    ],
  },
  {
    id: "health",
    title: "Health & Wellness",
    description: "Fitness, habits, and medical stuff",
    questions: [
      { id: "tracking", label: "What do you track for health?", type: "multiselect", options: ["Steps / activity", "Sleep", "Nutrition / calories", "Workouts", "Supplements", "Nothing", "Other"] },
      { id: "friction", label: "What's the most annoying part of managing your health?", type: "textarea", placeholder: "e.g. Remembering supplements, booking appointments, logging food..." },
    ],
  },
  {
    id: "productivity",
    title: "Personal Productivity",
    description: "How you manage tasks and your day",
    questions: [
      { id: "system", label: "What's your current task management system?", type: "text", placeholder: "e.g. Notion, Things 3, paper, nothing..." },
      { id: "routines", label: "Do you have morning or evening routines?", type: "textarea", placeholder: "Describe them briefly, or say 'no'..." },
      { id: "pain", label: "Where does your productivity break down most?", type: "textarea", placeholder: "e.g. Getting started, staying focused, planning the week..." },
    ],
  },
  {
    id: "communication",
    title: "Communication",
    description: "Email, messages, and follow-ups",
    questions: [
      { id: "email_volume", label: "Roughly how many emails do you get per day?", type: "text", placeholder: "e.g. 20, 100, 300+" },
      { id: "apps", label: "What messaging apps do you use?", type: "multiselect", options: ["Email", "Slack", "Teams", "iMessage", "WhatsApp", "Telegram", "Other"] },
      { id: "follow_ups", label: "How do you handle follow-ups and staying in touch?", type: "textarea", placeholder: "e.g. I forget constantly, I use reminders, I have a CRM..." },
    ],
  },
  {
    id: "home_life",
    title: "Home & Life",
    description: "The logistics of living",
    questions: [
      { id: "smart_home", label: "Do you have any smart home devices?", type: "text", placeholder: "e.g. Alexa, Nest, Hue lights, none..." },
      { id: "errands", label: "What household or errand tasks take too much time?", type: "textarea", placeholder: "e.g. Grocery planning, subscription management, scheduling maintenance..." },
    ],
  },
  {
    id: "learning",
    title: "Learning & Development",
    description: "How you grow and stay sharp",
    questions: [
      { id: "how", label: "How do you stay current in your field?", type: "textarea", placeholder: "e.g. Newsletters, podcasts, Twitter/X, courses..." },
      { id: "goals", label: "What skills are you trying to develop right now?", type: "textarea", placeholder: "e.g. AI tools, public speaking, coding, writing..." },
      { id: "friction", label: "What gets in the way of learning consistently?", type: "textarea", placeholder: "e.g. No time, too many tabs open, forget what I wanted to read..." },
    ],
  },
  {
    id: "content_consumption",
    title: "Content Consumption",
    description: "What you read, watch, and listen to",
    questions: [
      { id: "sources", label: "What are your main content sources?", type: "multiselect", options: ["Newsletters", "Podcasts", "YouTube", "Twitter/X", "Reddit", "Blogs", "Books", "TikTok", "Other"] },
      { id: "overwhelm", label: "Do you feel overwhelmed by content? What's the problem?", type: "textarea", placeholder: "e.g. Too many newsletters, can't keep up, nothing vs doom-scrolling..." },
    ],
  },
];
