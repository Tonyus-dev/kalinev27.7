import pontesLogicas from '../../docs/identity/00_PONTES_LOGICAS.md?raw';
import kalineIdentity from '../../docs/identity/01_KALINE_IDENTIDADE.md?raw';
import facetas from '../../docs/identity/02_FACETAS.md?raw';
import vozETom from '../../docs/identity/03_VOZ_E_TOM.md?raw';
import regrasProdutoReal from '../../docs/identity/04_REGRAS_PRODUTO_REAL.md?raw';
import kuan from '../../docs/identity/05_KUAN_YIN.md?raw';
import kharis from '../../docs/identity/06_KHARIS.md?raw';
import limitesV27 from '../../docs/identity/07_LIMITES_V27.md?raw';

const CODE_REQUEST_PATTERN = /\b(c[oó]digo|programa(?:r|ç[aã]o)?|debug|debugging|pr técnico|pull request|codex|lovable|cloudflare|supabase|arquitetura técnica|developer mode|promptforge|vibe-?code|coder|react|typescript|javascript)\b/i;

export const V27_CODE_RESPONSE = 'A V27 não escreve código. Esse escopo será atendido em app separado: Klio.';

export function isV27CodeRequest(userText: string): boolean {
  return CODE_REQUEST_PATTERN.test(userText);
}

export function buildIdentityContext(userText: string, facet: 'kaline' | 'kharis' | 'kuan' = 'kaline'): string {
  const normalizedFacet = facet === 'kharis' || facet === 'kuan' ? facet : 'kaline';
  const lowerText = userText.toLowerCase();
  void pontesLogicas;

  const docs = [
    '[IDENTIDADE CENTRAL]\n' + kalineIdentity,
  ];

  if (isV27CodeRequest(userText)) {
    docs.push('[LIMITES V27]\n' + limitesV27);
    return docs.join('\n\n---\n\n');
  }

  if (normalizedFacet === 'kharis' || /\b(kh[aá]ris|cuidado|simpli(?:cidade|ficar)|acess[ií]vel|rotina|apoio cognitivo)\b/i.test(lowerText)) {
    docs.push('[KHÁRIS]\n' + kharis);
  } else if (normalizedFacet === 'kuan' || /\b(kuan|cliente|guardi(?:ã|a|ões|oes)|servi[cç]o|agenda comercial|pagamento|atendimento|negócio|negocio)\b/i.test(lowerText)) {
    docs.push('[KUAN]\n' + kuan);
  } else if (/\b(faceta|facetas|modos|v27 pública|v27 publica)\b/i.test(lowerText)) {
    docs.push('[FACETAS]\n' + facetas);
  } else if (/\b(voz|tom|estilo|responda|comunica(?:r|ção|cao)|clareza)\b/i.test(lowerText)) {
    docs.push('[VOZ E TOM]\n' + vozETom);
  } else if (/\b(produto real|mock|placeholder|simula(?:r|ção|cao)|ci|build|lint|rollback)\b/i.test(lowerText)) {
    docs.push('[REGRAS DE PRODUTO REAL]\n' + regrasProdutoReal);
  }

  return docs.join('\n\n---\n\n');
}
