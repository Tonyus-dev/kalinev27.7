import type { SedimentationRepository } from './repository';
import type { ApproveSedimentInput, CreateSedimentInput, GardenMemory, Sediment } from './types';

const SEDIMENTS_KEY = "kaline_sediments_v2";
const GARDEN_KEY = "kaline_garden_v2";

function storage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function safeParseArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

function makeId(prefix: 'sed' | 'gar'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}`;
}

function nextReviewDate(): string {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

export class LocalStorageSedimentationRepository implements SedimentationRepository {
  async listSediments(): Promise<Sediment[]> {
    return safeParseArray<Sediment>(storage()?.getItem(SEDIMENTS_KEY) ?? null);
  }

  async saveSediments(items: Sediment[]): Promise<void> {
    storage()?.setItem(SEDIMENTS_KEY, JSON.stringify(items));
  }

  async addSediment(input: CreateSedimentInput): Promise<Sediment> {
    const text = input.text.trim();
    const sediments = await this.listSediments();
    const garden = await this.listGardenMemories();
    const normalized = normalizeText(text);
    const existing = sediments.find(item => normalizeText(item.text) === normalized);
    const existingGarden = garden.find(item => normalizeText(item.content) === normalized);

    if (existing) return existing;
    if (existingGarden) {
      return {
        id: existingGarden.derivedFromSedimentId ?? makeId('sed'),
        text,
        source: input.source,
        status: 'arquivado',
        createdAt: existingGarden.approvedAt,
        updatedAt: existingGarden.approvedAt,
        tags: input.tags ?? [],
        origin: input.origin,
      };
    }

    const now = new Date().toISOString();
    const sediment: Sediment = {
      id: makeId('sed'),
      text,
      source: input.source,
      status: 'pendente',
      createdAt: now,
      updatedAt: now,
      tags: input.tags ?? [],
      origin: input.origin,
    };
    await this.saveSediments([sediment, ...sediments]);
    return sediment;
  }

  async updateSediment(id: string, patch: Partial<Sediment>): Promise<Sediment[]> {
    const updated = (await this.listSediments()).map(item =>
      item.id === id ? { ...item, ...patch, id, updatedAt: new Date().toISOString() } : item
    );
    await this.saveSediments(updated);
    return updated;
  }

  async archiveSediment(id: string): Promise<Sediment[]> {
    return this.updateSediment(id, { status: 'arquivado' });
  }

  async deleteSediment(id: string): Promise<Sediment[]> {
    const updated = (await this.listSediments()).filter(item => item.id !== id);
    await this.saveSediments(updated);
    return updated;
  }

  async listGardenMemories(): Promise<GardenMemory[]> {
    return safeParseArray<GardenMemory>(storage()?.getItem(GARDEN_KEY) ?? null);
  }

  async saveGardenMemories(items: GardenMemory[]): Promise<void> {
    storage()?.setItem(GARDEN_KEY, JSON.stringify(items));
  }

  async approveSedimentToGarden(input: ApproveSedimentInput): Promise<{ sedimentId: string; gardenMemory: GardenMemory }> {
    const sediments = await this.listSediments();
    const sediment = sediments.find(item => item.id === input.sedimentId);
    if (!sediment) throw new Error('Sedimento local não encontrado.');

    const approvedAt = new Date().toISOString();
    const gardenMemory: GardenMemory = {
      id: makeId('gar'),
      title: input.title?.trim() || 'Memória local aprovada',
      content: input.content?.trim() || sediment.text,
      category: input.category ?? 'preferencia',
      tags: input.tags ?? sediment.tags,
      importance: Math.min(5, Math.max(1, input.importance ?? 3)),
      approvedAt,
      nextReviewAt: nextReviewDate(),
      archived: false,
      derivedFromSedimentId: sediment.id,
    };

    await this.saveGardenMemories([gardenMemory, ...(await this.listGardenMemories())]);
    await this.saveSediments(sediments.map(item => item.id === sediment.id ? { ...item, status: 'revisado', updatedAt: approvedAt } : item));
    return { sedimentId: sediment.id, gardenMemory };
  }
}
