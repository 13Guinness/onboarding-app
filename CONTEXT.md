# Project Context: Onboarding App

## Architecture

This is a Next.js 14 app using the App Router, TypeScript, Tailwind CSS, and shadcn/ui. It connects to a Neon Postgres database via Prisma ORM. Authentication is handled with Clerk (invitation-only).

## Data Flow

1.  User lands on the landing page (`/`).
2.  User clicks "Start Your Free Audit" and is redirected to the audit form (`/audit`).
3.  The audit form guides the user through a multi-step process, collecting responses for 9 domains.
4.  The app saves progress to localStorage.
5.  Upon form submission, the app sends a POST request to `/api/audit/submit`.
6.  The API route creates database records and triggers the Claude API to generate a branded PDF report.
7.  The user is redirected to a processing screen (`/generating`) while the report is generated.
8.  Once the processing is complete, the user is redirected to the report view (`/report/[id]`).
9.  The report view displays the personalized report with quick wins, full automation map, and implementation guide.
10. The user can download the report as a PDF.

## Components

-   `AuditForm`: Manages the multi-step audit form.
-   `ReportView`: Displays the personalized report.
-   `ui`: Contains shadcn/ui components.

## API Routes

-   `/api/audit/submit`: Accepts audit responses, creates DB records, triggers Claude API call, and returns report ID.
-   `/api/report/[id]/pdf`: Generates and streams PDF using `@react-pdf/renderer`.

## Environment Variables

-   `DATABASE_URL`: Neon Postgres connection string
-   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
-   `CLERK_SECRET_KEY`: Clerk secret key
-   `ANTHROPIC_API_KEY`: Anthropic API key