import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const report = await prisma.auditReport.findUnique({ where: { id } });

  if (!report) {
    return NextResponse.json({ ready: false });
  }

  // Report is ready when automationMap has content
  const ready =
    report.automationMap !== null &&
    typeof report.automationMap === "object" &&
    Object.keys(report.automationMap).length > 0;

  return NextResponse.json({ ready });
}
