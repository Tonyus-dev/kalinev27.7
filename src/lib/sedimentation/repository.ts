import type { ApproveSedimentInput, CreateSedimentInput, GardenMemory, Sediment } from './types';

export interface SedimentationRepository {
  listSediments(): Promise<Sediment[]>;
  saveSediments(items: Sediment[]): Promise<void>;
  addSediment(input: CreateSedimentInput): Promise<Sediment>;
  updateSediment(id: string, patch: Partial<Sediment>): Promise<Sediment[]>;
  archiveSediment(id: string): Promise<Sediment[]>;
  deleteSediment(id: string): Promise<Sediment[]>;

  listGardenMemories(): Promise<GardenMemory[]>;
  saveGardenMemories(items: GardenMemory[]): Promise<void>;
  approveSedimentToGarden(input: ApproveSedimentInput): Promise<{
    sedimentId: string;
    gardenMemory: GardenMemory;
  }>;
}
