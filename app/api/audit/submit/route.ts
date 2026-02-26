import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { generateAuditReport, AuditResponse } from "@/lib/claude";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, responses } = body as {
      name: string;
      email: string;
      responses: AuditResponse[];
    };

    if (!name || !email || !responses?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert client
    const client = await prisma.client.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    });

    // Save responses
    await prisma.auditResponse.deleteMany({ where: { clientId: client.id } });
    await prisma.auditResponse.createMany({
      data: responses.map((r) => ({
        clientId: client.id,
        domain: r.domain,
        answers: r.answers,
      })),
    });

    // Create placeholder report record so /generating can poll
    const placeholder = await prisma.auditReport.upsert({
      where: { clientId: client.id },
      update: { automationMap: {}, quickWins: [], implementationGuide: {}, generatedAt: new Date() },
      create: {
        clientId: client.id,
        automationMap: {},
        quickWins: [],
        implementationGuide: {},
      },
    });

    // Generate report async (fire-and-forget, update DB when done)
    const placeholderId = placeholder.id;
    generateAuditReport(responses, name)
      .then(async (report) => {
        await prisma.auditReport.update({
          where: { id: placeholderId },
          data: {
            automationMap: report.automationMap as unknown as Prisma.InputJsonValue,
            quickWins: report.quickWins as unknown as Prisma.InputJsonValue,
            implementationGuide: report.implementationGuide as unknown as Prisma.InputJsonValue,
          },
        });
      })
      .catch(console.error);

    return NextResponse.json({ reportId: placeholder.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
