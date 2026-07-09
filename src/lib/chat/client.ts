import type { FacetId } from '../sedimentation';

export type ChatHistoryItem = { role: 'user' | 'assistant'; content: string };
export type SendChatMessageInput = {
  message: string;
  facet: FacetId;
  identityContext: string;
  localContext?: string;
  history?: ChatHistoryItem[];
};
export type SendChatMessageResult = { ok: true; text: string } | { ok: false; error: string };

const OFFLINE_ERROR = 'Chat online indisponível: IA não configurada neste ambiente.';

export async function sendChatMessage(input: SendChatMessageInput): Promise<SendChatMessageResult> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await response.json().catch(() => null);
    if (data?.ok === true && typeof data.text === 'string') return { ok: true, text: data.text };
    if (response.status === 503) return { ok: false, error: data?.error || OFFLINE_ERROR };
    return { ok: false, error: typeof data?.error === 'string' ? data.error : 'Erro ao consultar o chat online.' };
  } catch {
    return { ok: false, error: 'Erro ao consultar o chat online.' };
  }
}
