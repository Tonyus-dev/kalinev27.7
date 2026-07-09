// APP_REGISTRY Canônico da Kaline Pritaneu V27
// Define os domínios de trabalho, facetas de IA, permissões e status.

export interface Surface {
  id: string;
  name: string;
  description: string;
  status: 'real' | 'mock' | 'planned';
  path: string;
}

export interface DomainRegistry {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  surfaces: Surface[];
}

export const APP_REGISTRY: Record<string, DomainRegistry> = {
  kaline: {
    id: 'kaline',
    name: 'Kaline',
    icon: 'Compass',
    color: '#C98A65', // Cobre Kaline
    description: 'Gestão pessoal, agenda, jurídico, corpo e presença.',
    surfaces: [
      { id: 'chat', name: 'Presença Chat', description: 'Canal de diálogo com filtro Qwen 1.5B', status: 'real', path: '/kaline' },
      { id: 'agenda', name: 'Agenda Pessoal', description: 'Compromissos e rituais diários', status: 'real', path: '/agenda' },
      { id: 'juridico', name: 'Jurídico', description: 'Salvaguardas e contratos legais', status: 'mock', path: '/juridico' }
    ]
  },
  kharis: {
    id: 'kharis',
    name: 'Kháris/Klio',
    icon: 'BookOpen',
    color: '#2563EB', // Azul Cuidado
    description: 'Cuidado pessoal, pedagogia e códice.',
    surfaces: [
      { id: 'codice', name: 'Códice', description: 'Documentação pedagógica e guias de rotina', status: 'mock', path: '/codice' },
      { id: 'eco', name: 'Câmara do Eco', description: 'Ambiente acústico de foco analítico', status: 'mock', path: '/eco' }
    ]
  },
  kuanyin: {
    id: 'kuanyin',
    name: 'Kuan-Yin',
    icon: 'Activity',
    color: '#BE185D', // Magenta Comercial
    description: 'Negócio, gestão de clientes e guardiões.',
    surfaces: [
      { id: 'negocios', name: 'Painel Comercial', description: 'Acompanhamento financeiro comercial', status: 'mock', path: '/kuanyin' },
      { id: 'guardioes', name: 'Guardiões', description: 'Supervisão de acessos administrativos', status: 'mock', path: '/guardioes' }
    ]
  },
  drive: {
    id: 'drive',
    name: 'Drive',
    icon: 'Share2',
    color: '#16A34A', // Mobilidade/Sincronização
    description: 'Gerenciamento de mobilidade e transferência local.',
    surfaces: [
      { id: 'taildrop', name: 'Taildrop Share', description: 'Transferência de arquivos em rede segura', status: 'real', path: '/tailscale' }
    ]
  },
  memory: {
    id: 'memory',
    name: 'Memória',
    icon: 'Layers',
    color: '#8B5CF6', // Violeta
    description: 'Armazenamento de conhecimento e revisões.',
    surfaces: [
      { id: 'jardim', name: 'Jardim de Notas', description: 'Conexão de ideias e pensamentos', status: 'real', path: '/jardim' },
      { id: 'revisao', name: 'Revisão Contínua', description: 'Métrica de repetição espaçada', status: 'real', path: '/revisao' }
    ]
  },
  system: {
    id: 'system',
    name: 'Sistema',
    icon: 'Cpu',
    color: '#F97316', // Hefaístia/Estação
    description: 'Monitoramento, diagnósticos, forja de IA e controle da estação física.',
    surfaces: [
      { id: 'pritaneu', name: 'Hub Pritaneu', description: 'Orquestração de microsserviços', status: 'real', path: '/pritaneu' },
      { id: 'station', name: 'Estação Héstia', description: 'Diagnóstico de hardware e serviços locais', status: 'real', path: '/station' },
      { id: 'forge', name: 'Forja Hefaístia', description: 'Lógica e benchmarks de IA Ollama local', status: 'real', path: '/forge' }
    ]
  }
};
