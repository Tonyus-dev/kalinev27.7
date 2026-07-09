export type SedimentStatus = "pendente" | "revisado" | "arquivado";
export type SedimentSource = "chat" | "manual" | "import";
export type FacetId = "kaline" | "kharis";
export type GardenCategory = "kaline" | "usuario" | "ecossistema" | "preferencia";

export type SedimentOrigin = {
  type: "chat" | "manual" | "import";
  messageId?: string;
  facet?: FacetId;
};

export type Sediment = {
  id: string;
  text: string;
  source: SedimentSource;
  status: SedimentStatus;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  origin?: SedimentOrigin;
};

export type CreateSedimentInput = {
  text: string;
  source: SedimentSource;
  tags?: string[];
  origin?: SedimentOrigin;
};

export type GardenMemory = {
  id: string;
  title: string;
  content: string;
  category: GardenCategory;
  tags: string[];
  importance: number;
  approvedAt: string;
  nextReviewAt: string;
  archived: boolean;
  derivedFromSedimentId?: string;
};

export type ApproveSedimentInput = {
  sedimentId: string;
  title?: string;
  content?: string;
  category?: GardenCategory;
  tags?: string[];
  importance?: number;
};
