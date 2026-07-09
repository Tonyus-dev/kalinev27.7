export type LedgerFacet = "kaline" | "kharis";

export type LedgerVisibility = "private" | "facet_only" | "shared";

export type LedgerStatus =
  | "draft"
  | "candidate"
  | "approved"
  | "discarded"
  | "archived";

export type LedgerEventType =
  | "decision"
  | "handoff"
  | "summary"
  | "memory_candidate"
  | "commercial_context"
  | "care_context"
  | "technical_context"
  | "local_sync"
  | "online_sync";

export type LedgerSource =
  | "chat"
  | "manual"
  | "system"
  | "import";

export type LedgerEvent = {
  id: string;
  type: LedgerEventType;
  title: string;
  content: string;
  originFacet: LedgerFacet;
  targetFacet?: LedgerFacet;
  visibility: LedgerVisibility;
  status: LedgerStatus;
  source: LedgerSource;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  discardedAt?: string;
  archivedAt?: string;
  relatedSedimentId?: string;
  relatedGardenMemoryId?: string;
  metadata?: Record<string, unknown>;
};

export type CreateLedgerEventInput = {
  type: LedgerEventType;
  title: string;
  content: string;
  originFacet: LedgerFacet;
  targetFacet?: LedgerFacet;
  visibility: LedgerVisibility;
  status?: LedgerStatus;
  source: LedgerSource;
  tags?: string[];
  relatedSedimentId?: string;
  relatedGardenMemoryId?: string;
  metadata?: Record<string, unknown>;
};
