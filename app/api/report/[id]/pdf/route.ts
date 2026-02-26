import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PDF generation placeholder — returns a simple text for now
// Replace with @react-pdf/renderer once server-side rendering is confirmed working
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.auditReport.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!report) {
    return new NextResponse("Report not found", { status: 404 });
  }

  // TODO: Implement full PDF with @react-pdf/renderer
  // For now return JSON export
  const exportData = {
    client: report.client.name,
    email: report.client.email,
    generatedAt: report.generatedAt,
    quickWins: report.quickWins,
    automationMap: report.automationMap,
    implementationGuide: report.implementationGuide,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="automation-report-${id}.json"`,
    },
  });
}
