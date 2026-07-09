export const SUPABASE_SEDIMENTATION_NOT_CONFIGURED =
  "Sedimentação Supabase ainda não configurada neste ambiente.";

// Ponte futura: este arquivo documenta o ponto de troca para Supabase.
// A UI já fala com service/repository.
// Quando Supabase entrar, trocar apenas o repository, não os componentes.
export function assertSupabaseSedimentationConfigured(): never {
  throw new Error(SUPABASE_SEDIMENTATION_NOT_CONFIGURED);
}
