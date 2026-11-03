"use server";

import { and, count, desc, eq, gte, isNull, lt, sum } from "drizzle-orm";
import { requireAdmin } from "@/auth/session";
import { getDb } from "@/db";
import { consultationBookings } from "@/db/schema/booking";
import { services, projects } from "@/db/schema/content";
import { faqs } from "@/db/schema/faqs";
import { inquiries } from "@/db/schema/packages";
import { quoteRequests } from "@/db/schema/calculator";
import {
  clientProjects,
  revisionRequests,
} from "@/db/schema/portal";
import { ok, toFailure, type ActionResult } from "../result";

export type AdminDashboardData = {
  content: {
    publishedProjects: number;
    activeServices: number;
    activeFaqs: number;
  };
  operations: null | {
    bookingsThisMonth: number;
    newInquiries: number;
    newQuotes: number;
    activeClientProjects: number;
    activeProjectValue: number;
    revisionsNeedingReview: number;
    latestBookings: Array<{
      id: string;
      reference: string;
      name: string;
      status: string;
      slotStart: Date;
    }>;
    latestInquiries: Array<{
      id: string;
      reference: string;
      name: string;
      status: string;
      createdAt: Date;
    }>;
    latestQuotes: Array<{
      id: string;
      reference: string;
      status: string;
      createdAt: Date;
    }>;
    revisions: Array<{
      id: string;
      clientProjectId: string;
      projectTitle: string;
      title: string;
      status: string;
      submittedAt: Date;
    }>;
    latestProjects?: Array<{
      id: string;
      projectTitle: string;
      clientName: string;
      currentStep: number;
      revisionsUsed: number;
      revisionsIncluded: number;
      paymentStatus: "unpaid" | "down_payment" | "paid_off";
      totalCost: number;
      balance: number;
    }>;
  };
};

const scalar = (rows: Array<{ value: number }>) => Number(rows[0]?.value ?? 0);

/** Reads operational totals only for owners; editor dashboards contain content totals. */
export async function readAdminDashboardAction(): Promise<
  ActionResult<AdminDashboardData>
> {
  try {
    const principal = await requireAdmin();
    const db = getDb();
    const [publishedProjects, activeServices, activeFaqs] = await Promise.all([
      db
        .select({ value: count() })
        .from(projects)
        .where(and(eq(projects.status, "published"), isNull(projects.deletedAt))),
      db.select({ value: count() }).from(services).where(eq(services.isActive, true)),
      db.select({ value: count() }).from(faqs).where(eq(faqs.isActive, true)),
    ]);

    const content = {
      publishedProjects: scalar(publishedProjects),
      activeServices: scalar(activeServices),
      activeFaqs: scalar(activeFaqs),
    };
    if (principal.role !== "owner") return ok({ content, operations: null });

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [
      bookingsThisMonth,
      newInquiries,
      newQuotes,
      activeClientProjects,
      activeProjectValue,
      revisionsNeedingReview,
      latestBookings,
      latestInquiries,
      latestQuotes,
      revisions,
      latestProjects,
    ] = await Promise.all([
      db
        .select({ value: count() })
        .from(consultationBookings)
        .where(
          and(
            gte(consultationBookings.createdAt, monthStart),
            lt(consultationBookings.createdAt, nextMonth),
            isNull(consultationBookings.archivedAt),
          ),
        ),
      db
        .select({ value: count() })
        .from(inquiries)
        .where(and(eq(inquiries.status, "new"), isNull(inquiries.archivedAt))),
      db
        .select({ value: count() })
        .from(quoteRequests)
        .where(and(eq(quoteRequests.status, "new"), isNull(quoteRequests.archivedAt))),
      db
        .select({ value: count() })
        .from(clientProjects)
        .where(and(isNull(clientProjects.archivedAt), isNull(clientProjects.deletedAt))),
      db
        .select({ value: sum(clientProjects.totalCost) })
        .from(clientProjects)
        .where(and(isNull(clientProjects.archivedAt), isNull(clientProjects.deletedAt))),
      db
        .select({ value: count() })
        .from(revisionRequests)
        .where(eq(revisionRequests.status, "submitted")),
      db
        .select({
          id: consultationBookings.id,
          reference: consultationBookings.reference,
          name: consultationBookings.name,
          status: consultationBookings.status,
          slotStart: consultationBookings.slotStart,
        })
        .from(consultationBookings)
        .where(isNull(consultationBookings.archivedAt))
        .orderBy(desc(consultationBookings.createdAt))
        .limit(5),
      db
        .select({
          id: inquiries.id,
          reference: inquiries.reference,
          name: inquiries.name,
          status: inquiries.status,
          createdAt: inquiries.createdAt,
        })
        .from(inquiries)
        .where(isNull(inquiries.archivedAt))
        .orderBy(desc(inquiries.createdAt))
        .limit(5),
      db
        .select({
          id: quoteRequests.id,
          reference: quoteRequests.reference,
          status: quoteRequests.status,
          createdAt: quoteRequests.createdAt,
        })
        .from(quoteRequests)
        .where(isNull(quoteRequests.archivedAt))
        .orderBy(desc(quoteRequests.createdAt))
        .limit(5),
      db
        .select({
          id: revisionRequests.id,
          clientProjectId: clientProjects.id,
          projectTitle: clientProjects.projectTitle,
          title: revisionRequests.title,
          status: revisionRequests.status,
          submittedAt: revisionRequests.submittedAt,
        })
        .from(revisionRequests)
        .innerJoin(
          clientProjects,
          eq(revisionRequests.clientProjectId, clientProjects.id),
        )
        .where(eq(revisionRequests.status, "submitted"))
        .orderBy(desc(revisionRequests.submittedAt))
        .limit(5),
      db
        .select({
          id: clientProjects.id,
          projectTitle: clientProjects.projectTitle,
          clientName: clientProjects.clientName,
          currentStep: clientProjects.currentStep,
          revisionsUsed: clientProjects.revisionsUsed,
          revisionsIncluded: clientProjects.revisionsIncluded,
          paymentStatus: clientProjects.paymentStatus,
          totalCost: clientProjects.totalCost,
          balance: clientProjects.balance,
        })
        .from(clientProjects)
        .where(and(isNull(clientProjects.archivedAt), isNull(clientProjects.deletedAt)))
        .orderBy(desc(clientProjects.createdAt))
        .limit(5),
    ]);

    return ok({
      content,
      operations: {
        bookingsThisMonth: scalar(bookingsThisMonth),
        newInquiries: scalar(newInquiries),
        newQuotes: scalar(newQuotes),
        activeClientProjects: scalar(activeClientProjects),
        activeProjectValue: Number(activeProjectValue[0]?.value ?? 0),
        revisionsNeedingReview: scalar(revisionsNeedingReview),
        latestBookings,
        latestInquiries,
        latestQuotes,
        revisions,
        latestProjects,
      },
    });
  } catch (error) {
    return toFailure(error);
  }
}
