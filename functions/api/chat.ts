type Env = { OPENROUTER_API_KEY?: string; OPENROUTER_CHAT_MODEL?: string };
type PagesFunction<E = Env> = (context: { request: Request; env: E }) => Response | Promise<Response>;
type ChatFacet = 'kaline';
type ChatHistoryItem = { role: 'user' | 'assistant'; content: string };

const OFFLINE_ERROR = 'Chat online indisponível: IA não configurada neste ambiente.';
const CODE_RESPONSE = 'A V27 não escreve código. Esse escopo será atendido em app separado: Klio.';
const VALID_FACETS = new Set<ChatFacet>(['kaline']);
const KUAN_RESPONSE = 'Kuan não está disponível na V27. Esse escopo será reconstruído em app separado.';
const KHARIS_RESPONSE = 'Kháris foi incorporada à Kaline como cuidado, presença e orientação simples.';
const SCOPE_RESPONSE = 'A V27 pública opera somente como Kaline. Kháris foi incorporada à Kaline como cuidado, presença e orientação simples.';
const SCOPE_REQUEST_PATTERN = /\b(quais facetas|facetas existem|facetas da v27|v27.*facetas|modos da v27|modo selecionável|faceta operacional)\b/i;
const KHARIS_REQUEST_PATTERN = /\b(kh[aá]ris|kharis|modo kh[aá]ris|faceta kh[aá]ris|cuidado da kh[aá]ris)\b/i;
const KUAN_REQUEST_PATTERN = /\b(kuan(?:-yin)?|kuan yin|comercial|guardi(?:ã|a|ões|oes)|cliente|neg[oó]cio|servi[cç]os?|pagamento|agendamento comercial)\b/i;
const CODE_REQUEST_PATTERN = /\b(c[oó]digo|programa(?:r|ç[aã]o)?|debug|pr técnico|pull request|codex|lovable|cloudflare|supabase|arquitetura técnica|developer\s+mode|promptforge|vibe-?code|coder|react|typescript|javascript)\b/i;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

function cleanString(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed && trimmed.length <= max ? trimmed : null;
}

function optionalString(value: unknown, max: number): string | undefined | null {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string' || value.length > max) return null;
  return value.trim() || undefined;
}

function sanitizeHistory(value: unknown): ChatHistoryItem[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 12) return null;
  const history: ChatHistoryItem[] = [];
  for (const item of value) {
    if (!item || (item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string') return null;
    const content = item.content.trim();
    if (!content || content.length > 8000) return null;
    history.push({ role: item.role, content });
  }
  return history;
}

function facetInstruction(_facet: ChatFacet): string {
  return 'Identidade operacional ativa: Kaline.';
}

function buildSystemPrompt(facet: ChatFacet, identityContext: string, localContext?: string): string {
  return [
    'Você é a V27 pública da Kaline. A V27 pública possui uma única identidade operacional: Kaline. Kháris foi incorporada à Kaline como cuidado, presença e orientação simples. Klio não pertence à V27 pública. Kuan não pertence à V27 pública. Responda de forma direta, clara, adulta e sem empatia artificial. Não invente dados. Se uma informação não estiver nos contextos fornecidos, diga que não consta como fonte disponível.',
    'Regras de prioridade: docs de identidade têm prioridade sobre contexto local. Jardim/sedimentos/contexto local nunca viram identidade canônica. Pedidos de programação são bloqueados.',
    facetInstruction(facet),
    `[IDENTIDADE CANÔNICA - /docs/identity]\n${identityContext}`,
    localContext ? `[CONTEXTOS LOCAIS ATIVOS - NÃO CANÔNICOS]\n${localContext}` : '',
  ].filter(Boolean).join('\n\n');
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') return json({ ok: false, error: 'Body inválido.' }, 400);

    const record = body as Record<string, unknown>;
    const message = cleanString(record.message, 8000);
    const identityContext = cleanString(record.identityContext, 20000);
    const localContext = optionalString(record.localContext, 20000);
    const history = sanitizeHistory(record.history);

    if (typeof record.facet !== 'string' || !VALID_FACETS.has(record.facet as ChatFacet)) {
      return json({ ok: false, error: 'Faceta inválida.' }, 400);
    }
    if (!message || !identityContext || localContext === null || history === null) {
      return json({ ok: false, error: 'Body inválido.' }, 400);
    }
    if (CODE_REQUEST_PATTERN.test(message)) return json({ ok: true, text: CODE_RESPONSE }, 200);
    if (SCOPE_REQUEST_PATTERN.test(message)) return json({ ok: true, text: SCOPE_RESPONSE }, 200);
    if (KHARIS_REQUEST_PATTERN.test(message)) return json({ ok: true, text: KHARIS_RESPONSE }, 200);
    if (KUAN_REQUEST_PATTERN.test(message)) return json({ ok: true, text: KUAN_RESPONSE }, 200);
    if (!env.OPENROUTER_API_KEY || !env.OPENROUTER_CHAT_MODEL) return json({ ok: false, error: OFFLINE_ERROR }, 503);

    const facet = record.facet as ChatFacet;
    const providerResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENROUTER_API_KEY}` },
      body: JSON.stringify({
        model: env.OPENROUTER_CHAT_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(facet, identityContext, localContext) },
          ...history,
          { role: 'user', content: message },
        ],
      }),
    });

    if (!providerResponse.ok) return json({ ok: false, error: 'Erro ao consultar o provedor de IA.' }, 500);
    const data = await providerResponse.json() as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return json({ ok: false, error: 'Erro ao consultar o provedor de IA.' }, 500);
    return json({ ok: true, text }, 200);
  } catch (error) {
    console.error('Erro inesperado em /api/chat', error);
    return json({ ok: false, error: 'Erro inesperado no chat online.' }, 500);
  }
};

export const onRequest: PagesFunction<Env> = async () => json({ ok: false, error: 'Método não permitido.' }, 405);
