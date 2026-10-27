import { prisma } from "@/lib/db";

export function findOwnedReport(reportId: string, clerkUserId: string) {
  return prisma.auditReport.findFirst({
    where: {
      id: reportId,
      client: { clerkUserId },
    },
    include: { client: true },
  });
}
