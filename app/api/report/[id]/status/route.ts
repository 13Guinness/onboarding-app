import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { findOwnedReport } from "@/lib/owned-report";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  const report = userId ? await findOwnedReport(id, userId) : null;

  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Report is ready when automationMap has content
  const ready =
    report.automationMap !== null &&
    typeof report.automationMap === "object" &&
    Object.keys(report.automationMap).length > 0;

  return NextResponse.json({ ready });
}
