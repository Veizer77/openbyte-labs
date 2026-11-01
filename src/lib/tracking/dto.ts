import type {
  clientProjects,
  projectSteps,
  projectMilestones,
  payments,
  projectUpdates,
  projectDocuments,
  revisionRequests,
  projectComments,
  projectApprovals,
} from "@/db/schema/portal";
import { trackingUrl, visibilitySchema } from "@/schemas/tracking";

export interface TrackingBundle {
  project: typeof clientProjects.$inferSelect;
  steps: (typeof projectSteps.$inferSelect)[];
  milestones: (typeof projectMilestones.$inferSelect)[];
  payments: (typeof payments.$inferSelect)[];
  updates: (typeof projectUpdates.$inferSelect)[];
  documents: (typeof projectDocuments.$inferSelect)[];
  revisions: (typeof revisionRequests.$inferSelect)[];
  comments: (typeof projectComments.$inferSelect)[];
  approvals: (typeof projectApprovals.$inferSelect)[];
}

/** Explicit projection is the last boundary before data reaches a client browser. */
export function toClientPortal(bundle: TrackingBundle) {
  const p = bundle.project;
  const v = visibilitySchema.parse(p.clientVisibility);
  const safeLink = (url: string | null) =>
    trackingUrl.safeParse(url).success ? url : null;
  return {
    project: {
      id: p.id,
      trackingCode: p.trackingCode,
      clientName: p.clientName,
      projectTitle: p.projectTitle,
      startDate: p.startDate,
      targetCompletionDate: p.targetCompletionDate,
      currentStep: p.currentStep,
      revisionsUsed: p.revisionsUsed,
      revisionsIncluded: p.revisionsIncluded,
      extraRevisionPrice: p.extraRevisionPrice,
      revisionPolicy: p.revisionPolicySnapshot,
      isReviewOpen: p.isReviewOpen,
      updatedAt: p.updatedAt,
      stagingUrl: v.staging ? safeLink(p.stagingUrl) : null,
      productionUrl: v.production ? safeLink(p.productionUrl) : null,
      githubUrl: v.github ? safeLink(p.githubUrl) : null,
    },
    steps: bundle.steps.map((step) => ({
      id: step.id,
      stepNumber: step.stepNumber,
      title: step.title,
      description: step.description,
      status: step.status,
      completedAt: step.completedAt,
      milestones: bundle.milestones
        .filter((m) => m.projectStepId === step.id)
        .map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          isCompleted: m.isCompleted,
        })),
    })),
    payment: v.payments
      ? {
          totalCost: p.totalCost,
          paidAmount: p.paidAmount,
          balance: p.balance,
          status: p.paymentStatus,
          history: bundle.payments
            .filter((r) => r.isVisibleToClient)
            .map((r) => ({
              id: r.id,
              paidAt: r.paidAt,
              amount: r.amount,
              method: r.method,
              note: r.note,
              proofFileId: r.proofFileId,
            })),
        }
      : null,
    updates: v.timeline
      ? bundle.updates
          .filter((r) => r.isVisibleToClient)
          .map((r) => ({
            id: r.id,
            title: r.title,
            body: r.body,
            createdAt: r.createdAt,
          }))
      : [],
    documents: v.documents
      ? bundle.documents
          .filter(
            (r) =>
              r.isVisibleToClient && (r.type === "file" || safeLink(r.url)),
          )
          .map((r) => ({
            id: r.id,
            title: r.title,
            type: r.type,
            url: r.url,
            fileId: r.fileId,
          }))
      : [],
    revisions: bundle.revisions.map((r) => ({
      id: r.id,
      roundNumber: r.roundNumber,
      type: r.type,
      title: r.title,
      description: r.description,
      attachments: r.attachments,
      status: r.status,
      quotedPrice: r.quotedPrice,
      clientAcceptedQuoteAt: r.clientAcceptedQuoteAt,
      adminResponse: r.adminResponse,
      submittedAt: r.submittedAt,
    })),
    comments: bundle.comments
      .filter((r) => !r.isInternal)
      .map((r) => ({
        id: r.id,
        revisionRequestId: r.revisionRequestId,
        authorType: r.authorType,
        authorName: r.authorName,
        body: r.body,
        attachments: r.attachments,
        createdAt: r.createdAt,
      })),
    approvals: bundle.approvals.map((r) => ({
      id: r.id,
      type: r.type,
      approvedByName: r.approvedByName,
      note: r.note,
      approvedAt: r.approvedAt,
    })),
  };
}
export type ClientPortal = ReturnType<typeof toClientPortal>;
export function toAdminProject(p: TrackingBundle["project"]) {
  const { accessPinHash: _hash, ...safe } = p;
  void _hash;
  return safe;
}
export type AdminClientProject = ReturnType<typeof toAdminProject>;
export type AdminTrackingDetail = Omit<TrackingBundle, "project"> & {
  project: AdminClientProject;
};
