import kalineIdentity from '../../docs/identity/01_KALINE_IDENTIDADE.md?raw';
import facetas from '../../docs/identity/02_FACETAS.md?raw';
import vozETom from '../../docs/identity/03_VOZ_E_TOM.md?raw';
import regrasProdutoReal from '../../docs/identity/04_REGRAS_PRODUTO_REAL.md?raw';
import kharis from '../../docs/identity/06_KHARIS.md?raw';
import limitesV27 from '../../docs/identity/07_LIMITES_V27.md?raw';
import ledger from '../../docs/identity/08_LEDGER.md?raw';

const LEDGER_REQUEST_PATTERN = /\b(ledger|mnem[oó]sine|mnemosine|handoff|evento aprov[aá]vel|facetas|continuidade online\/local|registro para kh[aá]ris)\b/i;
const CODE_REQUEST_PATTERN = /\b(c[oó]digo|programa(?:r|ç[aã]o)?|debug|pr técnico|pull request|codex|lovable|cloudflare|supabase|arquitetura técnica|developer\s+mode|promptforge|vibe-?code|coder|react|typescript|javascript)\b/i;
const KUAN_REQUEST_PATTERN = /\b(kuan(?:-yin)?|kuan yin|comercial|guardi(?:ã|a|ões|oes)|cliente|neg[oó]cio|servi[cç]os?|pagamento|agendamento comercial)\b/i;

export const V27_CODE_RESPONSE = 'A V27 não escreve código. Esse escopo será atendido em app separado: Klio.';
export const V27_KUAN_RESPONSE = 'Kuan não está disponível na V27. Esse escopo será reconstruído em app separado.';

export function isV27CodeRequest(userText: string): boolean {
  return CODE_REQUEST_PATTERN.test(userText);
}

export function isV27KuanRequest(userText: string): boolean {
  return KUAN_REQUEST_PATTERN.test(userText);
}

function isLedgerRequest(userText: string): boolean {
  return LEDGER_REQUEST_PATTERN.test(userText);
}

export function buildIdentityContext(userText: string, facet: 'kaline' | 'kharis' = 'kaline'): string {
  const normalizedFacet = facet === 'kharis' ? facet : 'kaline';
  const lowerText = userText.toLowerCase();

  const docs = [
    '[IDENTIDADE CENTRAL]\n' + kalineIdentity,
  ];

  if (isV27CodeRequest(userText) || isV27KuanRequest(userText)) {
    docs.push('[LIMITES V27]\n' + limitesV27);
    return docs.join('\n\n---\n\n');
  }

  if (isLedgerRequest(userText)) {
    docs.push('[LEDGER]\n' + ledger);
    return docs.join('\n\n---\n\n');
  }

  if (normalizedFacet === 'kharis' || /\b(kh[aá]ris|cuidado|simpli(?:cidade|ficar)|acess[ií]vel|rotina|apoio cognitivo)\b/i.test(lowerText)) {
    docs.push('[KHÁRIS]\n' + kharis);
  } else if (/\b(faceta|facetas|modos|v27 pública|v27 publica)\b/i.test(lowerText)) {
    docs.push('[FACETAS]\n' + facetas);
  } else if (/\b(voz|tom|estilo|responda|comunica(?:r|ção|cao)|clareza)\b/i.test(lowerText)) {
    docs.push('[VOZ E TOM]\n' + vozETom);
  } else if (/\b(produto real|mock|placeholder|simula(?:r|ção|cao)|ci|build|lint|rollback)\b/i.test(lowerText)) {
    docs.push('[REGRAS DE PRODUTO REAL]\n' + regrasProdutoReal);
  }

  return docs.join('\n\n---\n\n');
}
