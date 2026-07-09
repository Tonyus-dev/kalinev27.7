import { LocalStorageSedimentationRepository } from './localStorageRepository';
import type { ApproveSedimentInput, CreateSedimentInput } from './types';
import type { SedimentationRepository } from './repository';
import { assertSupabaseSedimentationConfigured } from './supabaseBridge';

type SedimentationBackend = "local" | "supabase";

const localRepository = new LocalStorageSedimentationRepository();

function currentBackend(): SedimentationBackend {
  if (typeof window === 'undefined') return 'local';
  return window.localStorage.getItem("kaline_sedimentation_backend") === "supabase" ? "supabase" : "local";
}

function repository(): SedimentationRepository {
  if (currentBackend() === 'supabase') {
    try {
      assertSupabaseSedimentationConfigured();
    } catch (error) {
      console.warn('Sedimentação Supabase indisponível; usando persistência local explicitamente.', error);
    }
  }
  return localRepository;
}

export function listSediments() {
  return repository().listSediments();
}

export function addSedimentCandidate(input: CreateSedimentInput) {
  return repository().addSediment(input);
}

export function updateSediment(id: string, patch: Parameters<SedimentationRepository['updateSediment']>[1]) {
  return repository().updateSediment(id, patch);
}

export function archiveSediment(id: string) {
  return repository().archiveSediment(id);
}

export function deleteSediment(id: string) {
  return repository().deleteSediment(id);
}

export function listGardenMemories() {
  return repository().listGardenMemories();
}

export function approveSedimentToGarden(input: ApproveSedimentInput) {
  return repository().approveSedimentToGarden(input);
}

export function saveGardenMemories(items: Awaited<ReturnType<SedimentationRepository['listGardenMemories']>>) {
  return repository().saveGardenMemories(items);
}
