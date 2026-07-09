// Hefaístia Client - Forja local de IA e gerenciamento do Ollama (:4518)
// Integrado com simulações caso o serviço local esteja offline.

export interface ForgeModel {
  name: string;
  size: string;
  parameterCount: string;
  quantization: string;
  status: 'active' | 'downloaded' | 'not_installed';
}

export interface ForgeTask {
  id: string;
  title: string;
  type: 'code' | 'refactor' | 'optimize' | 'benchmark';
  prompt: string;
  result?: string;
  latencyMs?: number;
  tokensPerSec?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface HefaistiaStatus {
  online: boolean;
  ollamaOnline: boolean;
  currentModel: string;
  localModels: ForgeModel[];
  benchmark: {
    lastTest: string;
    model: string;
    tps: number; // Tokens per second
    latencyMs: number;
    ramUsed: string;
  };
  tasks: ForgeTask[];
}

const DEFAULT_URL = 'http://127.0.0.1:4518';

export async function fetchHefaistiaStatus(baseUrl: string = DEFAULT_URL): Promise<HefaistiaStatus> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${baseUrl}/api/health`, { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      const data = await res.json();
      return { ...data, online: true };
    }
  } catch (err) {
    // Falhou, usa simulação abaixo
  }

  // Simulação Honesta de Alta Fidelidade (Hefaístia Offline/Mock)
  return {
    online: false,
    ollamaOnline: true,
    currentModel: 'qwen2.5-coder:7b',
    localModels: [
      { name: 'qwen2.5-coder:7b', size: '4.7 GB', parameterCount: '7.2B', quantization: 'Q4_K_M', status: 'active' },
      { name: 'qwen2.5:1.5b', size: '986 MB', parameterCount: '1.5B', quantization: 'Q4_K_M', status: 'downloaded' },
      { name: 'qwen2.5:3b', size: '1.9 GB', parameterCount: '3.1B', quantization: 'Q4_K_M', status: 'downloaded' },
      { name: 'qwen2.5:0.5b', size: '394 MB', parameterCount: '0.5B', quantization: 'Q4_K_M', status: 'not_installed' }
    ],
    benchmark: {
      lastTest: '05:31',
      model: 'qwen2.5-coder:7b',
      tps: 34.2,
      latencyMs: 125,
      ramUsed: '5.2 GB'
    },
    tasks: [
      {
        id: '1',
        title: 'Helper nativo para formatar moeda',
        type: 'code',
        prompt: 'Gere um helper nativo minimalista para formatar valores monetários em BRL.',
        result: `// Código otimizado Ponytail\nexport const fmtBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });`,
        latencyMs: 380,
        tokensPerSec: 42.5,
        status: 'completed'
      },
      {
        id: '2',
        title: 'Refatoração anti-alucinação',
        type: 'refactor',
        prompt: 'Otimizar o loop de verificação de permissão do app registry sem imports.',
        result: `// Otimização direta\nconst canAccess = (role, path) => APP_REGISTRY[path]?.roles.includes(role);`,
        latencyMs: 250,
        tokensPerSec: 38.1,
        status: 'completed'
      }
    ]
  };
}
