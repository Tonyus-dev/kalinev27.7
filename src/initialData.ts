import { Habit, PRStep } from './types';

// Helper to get formatted date string for relative days
export function getRelativeDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Meditação Mindfulness',
    description: 'Começar o dia com clareza mental e respiração consciente.',
    category: 'morning',
    frequency: 'daily',
    targetValue: 10,
    unit: 'min',
    color: 'violet',
    icon: 'Compass',
    createdAt: getRelativeDateString(10),
    streak: 5,
    maxStreak: 7,
    history: {
      [getRelativeDateString(0)]: 10,
      [getRelativeDateString(1)]: 10,
      [getRelativeDateString(2)]: 10,
      [getRelativeDateString(3)]: 10,
      [getRelativeDateString(4)]: 10,
      [getRelativeDateString(5)]: 0,
      [getRelativeDateString(6)]: 10,
      [getRelativeDateString(7)]: 10,
    }
  },
  {
    id: 'habit-2',
    name: 'Hidratação Constante',
    description: 'Beber água regularmente para manter o foco e a energia.',
    category: 'all',
    frequency: 'daily',
    targetValue: 8,
    unit: 'copos',
    color: 'sky',
    icon: 'Droplet',
    createdAt: getRelativeDateString(10),
    streak: 3,
    maxStreak: 6,
    history: {
      [getRelativeDateString(0)]: 5, // 5 out of 8 completed today so far
      [getRelativeDateString(1)]: 8,
      [getRelativeDateString(2)]: 8,
      [getRelativeDateString(3)]: 8,
      [getRelativeDateString(4)]: 4,
      [getRelativeDateString(5)]: 8,
      [getRelativeDateString(6)]: 8,
    }
  },
  {
    id: 'habit-3',
    name: 'Treino Funcional',
    description: 'Manter o corpo ativo com exercícios de força e mobilidade.',
    category: 'afternoon',
    frequency: 'custom',
    customDays: [1, 3, 5], // Mon, Wed, Fri
    targetValue: 1,
    unit: 'treino',
    color: 'rose',
    icon: 'Dumbbell',
    createdAt: getRelativeDateString(15),
    streak: 4,
    maxStreak: 5,
    history: {
      [getRelativeDateString(0)]: 1, // Today (Monday 2026-07-06 is Mon, yes!)
      [getRelativeDateString(2)]: 0, // Saturday (no)
      [getRelativeDateString(3)]: 1, // Friday (yes)
      [getRelativeDateString(5)]: 1, // Wednesday (yes)
      [getRelativeDateString(7)]: 1, // Monday (yes)
    }
  },
  {
    id: 'habit-4',
    name: 'Leitura Produtiva',
    description: 'Ler livros de não-ficção ou artigos de desenvolvimento pessoal.',
    category: 'night',
    frequency: 'daily',
    targetValue: 20,
    unit: 'min',
    color: 'amber',
    icon: 'BookOpen',
    createdAt: getRelativeDateString(8),
    streak: 6,
    maxStreak: 6,
    history: {
      [getRelativeDateString(0)]: 0, // Not read yet today
      [getRelativeDateString(1)]: 20,
      [getRelativeDateString(2)]: 25,
      [getRelativeDateString(3)]: 20,
      [getRelativeDateString(4)]: 20,
      [getRelativeDateString(5)]: 20,
      [getRelativeDateString(6)]: 30,
    }
  },
  {
    id: 'habit-5',
    name: 'Planejar o Amanhã',
    description: 'Rever as tarefas e definir as 3 prioridades do próximo dia.',
    category: 'night',
    frequency: 'daily',
    targetValue: 1,
    unit: 'vez',
    color: 'emerald',
    icon: 'Calendar',
    createdAt: getRelativeDateString(5),
    streak: 2,
    maxStreak: 3,
    history: {
      [getRelativeDateString(1)]: 1,
      [getRelativeDateString(2)]: 1,
      [getRelativeDateString(3)]: 0,
      [getRelativeDateString(4)]: 1,
    }
  }
];

export const GITHUB_PR_PLAN: PRStep[] = [
  {
    title: 'PR 1: Setup do Supabase & Tabelas de Monitoramento Desktop',
    branchName: 'feature/supabase-schema-monitoring',
    status: 'completed',
    description: 'Criação do esquema relacional de tabelas no Supabase para usuários, hábitos, logs de hábitos, conexões de peers Tailscale e atividades registradas no desktop.',
    scope: [
      'Criação das tabelas centrais: profiles, habits, habit_logs e daily_logs.',
      'Criação da tabela desktop_activities para guardar registros enviados pelo monitor do computador (app, janela em foco, duração).',
      'Criação da tabela tailscale_peers para registrar IPs e nomes de dispositivos autorizados na Tailnet.',
      'Configuração das chaves estrangeiras com CASCADE na exclusão e índices otimizados para busca rápida de logs por data.',
      'Ativação de Row Level Security (RLS) para isolamento absoluto de dados entre contas de usuários.'
    ],
    codeSnippetTitle: 'Schema SQL para Supabase (Pasta supabase/migrations/)',
    codeSnippet: `-- 1. Perfis de Usuários
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  full_name TEXT
);

-- 2. Tabela de Hábitos
CREATE TABLE public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'all', -- morning, afternoon, night, all
  frequency TEXT DEFAULT 'daily',
  custom_days INTEGER[], -- Array de 0 (Dom) a 6 (Sab)
  target_value INTEGER DEFAULT 1,
  unit TEXT DEFAULT 'vez',
  color TEXT DEFAULT 'indigo',
  icon TEXT DEFAULT 'CheckCircle',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0
);

-- 3. Histórico de Logs de Hábitos
CREATE TABLE public.habit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  habit_id UUID REFERENCES public.habits ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  value_completed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_habit_user_date UNIQUE (habit_id, date)
);

-- 4. Monitoramento Desktop Ativo (Novo)
CREATE TABLE public.desktop_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  app_name TEXT NOT NULL,
  window_title TEXT,
  duration_seconds INTEGER NOT NULL,
  category TEXT DEFAULT 'neutral', -- productive, distracting, neutral
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desktop_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários acessam apenas seu perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários gerenciam seus próprios hábitos" ON public.habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuários gerenciam seus próprios logs de hábitos" ON public.habit_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuários gerenciam suas atividades desktop" ON public.desktop_activities FOR ALL USING (auth.uid() = user_id);`
  },
  {
    title: 'PR 2: API Gateway no Cloudflare Workers com Validação Tailscale IP',
    branchName: 'feature/cloudflare-workers-tailscale-api',
    status: 'completed',
    description: 'Implementação de uma API ágil com Hono no Cloudflare Workers com endpoints para sincronização do PWA, monitoramento de desktop e verificação de IP de origem do Tailscale.',
    scope: [
      'Criação do projeto Hono e roteamento central de requisições utilizando wrangler.',
      'Middleware de autenticação validando o JWT do Supabase Auth em rotas padrão.',
      'Validação opcional baseada no cabeçalho de IP de origem (X-Real-IP) para requisições provindas da subrede Tailscale autorizada (100.x.y.z).',
      'Rotas POST /api/desktop/activity para ingestão de métricas do computador.',
      'Otimização de consultas consolidadas no Supabase para reduzir o tempo de resposta do PWA.'
    ],
    codeSnippetTitle: 'Cloudflare Worker Entrypoint com Hono (src/index.ts)',
    codeSnippet: `import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';

const app = new Hono<{ Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string } }>();

app.use('/api/*', cors());

// Middleware: Verifica se a requisição é autenticada ou provém da Tailnet (IP 100.x)
app.use('/api/*', async (c, next) => {
  const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Real-IP') || '';
  const isTailscale = clientIP.startsWith('100.'); // Endereços padrão da Tailscale
  
  if (isTailscale) {
    c.set('is_tailscale_trust', true);
  }
  
  const authHeader = c.req.header('Authorization');
  if (!authHeader && !isTailscale) {
    return c.json({ error: 'Acesso negado: Requer autenticação ou conexão Tailscale' }, 401);
  }
  
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
  c.set('supabase', supabase);
  await next();
});

// Registrar atividades enviadas em background pelo daemon do desktop
app.post('/api/desktop/activity', async (c) => {
  const supabase = c.get('supabase');
  const body = await c.req.json();
  const { user_id, app_name, window_title, duration_seconds, category } = body;

  const { data, error } = await supabase
    .from('desktop_activities')
    .insert({
      user_id,
      app_name,
      window_title,
      duration_seconds,
      category
    });

  if (error) return c.json({ error: error.message }, 400);
  return c.json({ success: true, message: 'Atividade computador gravada com sucesso.' });
});

export default app;`
  },
  {
    title: 'PR 3: Daemon de Monitoramento Desktop (Tauri / Python)',
    branchName: 'feature/desktop-companion-daemon',
    status: 'completed',
    description: 'Implementação de um pequeno script local para rodar em segundo plano no computador, identificando processos ativos e reportando o tempo de foco.',
    scope: [
      'Desenvolvimento de script em Python ou Node.js (empacotável via PyInstaller ou executado via Tauri em Rust).',
      'Uso da biblioteca nativa pygetwindow / psutil (Python) ou node-active-window para buscar o título da janela em foco.',
      'Controle de inatividade do usuário: pausar monitoramento se não houver clique ou digitação por mais de 5 minutos.',
      'Sincronização silenciosa: postar os dados em lote a cada 1 minuto para o Cloudflare Worker.',
      'Tratamento offline: salvar logs em um banco SQLite local na máquina e esvaziar ao obter conexão de internet.'
    ],
    codeSnippetTitle: 'Script Desktop Monitor em Python (monitor.py)',
    codeSnippet: `import time
import requests
import win32gui # para Windows, usar equivalent em macOS
import win32process
import psutil

USER_ID = "uuid-do-usuario-supabase"
API_URL = "https://sua-api.workers.dev/api/desktop/activity"
TOKEN = "token-jwt-do-usuario-ou-acesso-via-tailscale-ip"

def get_active_window():
    try:
        hwnd = win32gui.GetForegroundWindow()
        title = win32gui.GetWindowText(hwnd)
        _, pid = win32process.GetWindowThreadProcessId(hwnd)
        proc = psutil.Process(pid)
        return proc.name(), title
    except Exception:
        return "Unknown", "Unknown"

# Loop de varredura
while True:
    app, title = get_active_window()
    # Determina categoria produtiva simples
    category = "productive" if "VS Code" in title or "Terminal" in app else "distracting"
    
    payload = {
        "user_id": USER_ID,
        "app_name": app,
        "window_title": title,
        "duration_seconds": 15,
        "category": category
    }
    
    try:
        requests.post(API_URL, json=payload, headers={"Authorization": f"Bearer {TOKEN}"})
    except Exception as e:
        print("Erro ao enviar estatísticas, gravando no SQLite local...", e)
        
    time.sleep(15) # varredura a cada 15 segundos`
  },
  {
    title: 'PR 4: Sincronização Local-First, Offline & Compartilhamento Tailscale',
    branchName: 'feature/local-first-pwa-taildrop',
    status: 'current',
    description: 'Implementação de persistência IndexedDB no PWA para funcionamento offline e suporte a envio de arquivos em rede local via recurso Taildrop do Tailscale.',
    scope: [
      'Integração de banco IndexedDB no PWA utilizando a biblioteca leve idb para cache rápido.',
      'Fila outbox local de transações que armazena atualizações de hábitos realizadas enquanto desconectado.',
      'Sincronização bidirecional robusta resolvendo conflitos pelo registro updated_at mais recente.',
      'Habilitação do suporte ao recurso Taildrop para transferência nativa peer-to-peer de arquivos de backup.',
      'Feedback em tela sobre conectividade à internet e presença dos peers da Tailnet.'
    ],
    codeSnippetTitle: 'Classe OfflineSyncManager (src/lib/sync.ts)',
    codeSnippet: `export class OfflineSyncManager {
  private static OUTBOX_KEY = 'rotina_offline_outbox';
  
  static getOutbox() {
    const raw = localStorage.getItem(this.OUTBOX_KEY);
    return raw ? JSON.parse(raw) : [];
  }
  
  static addToOutbox(task: { type: string; payload: any }) {
    const outbox = this.getOutbox();
    outbox.push({
      ...task,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    });
    localStorage.setItem(this.OUTBOX_KEY, JSON.stringify(outbox));
  }
  
  static async syncWithServer(token: string, endpoint: string) {
    const outbox = this.getOutbox();
    if (outbox.length === 0) return true;
    
    const remaining = [];
    for (const task of outbox) {
      try {
        const response = await fetch(\`\${endpoint}/api/habits/log\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${token}\`
          },
          body: JSON.stringify(task.payload)
        });
        if (!response.ok) throw new Error();
      } catch (e) {
        remaining.push(task);
      }
    }
    localStorage.setItem(this.OUTBOX_KEY, JSON.stringify(remaining));
    return remaining.length === 0;
  }
}`
  },
  {
    title: 'PR 5: Automação CI/CD GitHub Actions & Deploy no Cloudflare',
    branchName: 'release/v1.0.0',
    status: 'pending',
    description: 'Configuração do pipeline completo no GitHub Actions para implantação automatizada do Front-end (Cloudflare Pages) e do Worker (Cloudflare Workers).',
    scope: [
      'Configuração do arquivo .github/workflows/deploy.yml contendo as etapas de compilação.',
      'Utilização da action cloudflare/wrangler-action para deploy ágil do Worker.',
      'Utilização da action cloudflare/pages-action para publicação das páginas estáticas do PWA.',
      'Configuração dos segredos CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID nas configurações de repositório do GitHub.',
      'Configuração de página offline customizada no Service Worker para os navegadores Safari e Chrome.'
    ],
    codeSnippetTitle: 'Workflow GitHub Actions (.github/workflows/deploy.yml)',
    codeSnippet: `name: Build and Deploy Fullstack PWA

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install Dependencies
        run: npm ci
      - name: Build Web Application
        run: npm run build
      - name: Deploy to Cloudflare Pages (Frontend)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: 'controle-rotina-frontend'
          directory: 'dist'
          gitBranch: 'main'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy Cloudflare Worker (Backend API)
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: 'backend-worker'
          command: deploy`
  }
];
