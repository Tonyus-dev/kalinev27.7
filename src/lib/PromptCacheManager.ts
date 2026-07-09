import { cacheStatsTracker } from './CacheStatsTracker';
interface CacheToken {
  id: string;
  expiresAt: number;
  hash: string;
}

class PromptCacheManager {
  private static instance: PromptCacheManager;
  private tokens: Map<string, CacheToken> = new Map();

  private constructor() {}

  static getInstance() {
    if (!PromptCacheManager.instance) {
      PromptCacheManager.instance = new PromptCacheManager();
    }
    return PromptCacheManager.instance;
  }

  // Define um TTL baseado no provedor
  // Gemini: 1 hora
  // OpenRouter (ex: Anthropic): 5 minutos
  private getTTLForProvider(provider: 'gemini' | 'openrouter'): number {
    if (provider === 'gemini') return 60 * 60 * 1000;
    return 5 * 60 * 1000;
  }

  async getValidCacheToken(
    provider: 'gemini' | 'openrouter',
    promptContext: string,
    createCacheFn: () => Promise<{ id: string, ttl?: number }>
  ): Promise<string | null> {
    const isEnabled = localStorage.getItem('kaline_prompt_caching') !== 'false';
    if (!isEnabled) return null;

    const hash = await this.hashString(promptContext);
    const existingToken = this.tokens.get(provider);

    if (existingToken && existingToken.hash === hash && existingToken.expiresAt > Date.now()) {
      console.log(`[PromptCacheManager] Cache Hit (${provider}): TTL válido.`);
      cacheStatsTracker.recordHit(`prompt_${provider}` as any, provider === 'gemini' ? 0.0005 : 0.001);
      return existingToken.id;
    }

    console.log(`[PromptCacheManager] Cache Miss (${provider}): Renovando cache...`);
    cacheStatsTracker.recordMiss(`prompt_${provider}` as any);
    try {
      const newCache = await createCacheFn();
      const ttl = newCache.ttl || this.getTTLForProvider(provider);
      
      this.tokens.set(provider, {
        id: newCache.id,
        expiresAt: Date.now() + ttl - 5000, // 5 segundos de margem de segurança
        hash
      });

      return newCache.id;
    } catch (e) {
      console.warn(`[PromptCacheManager] Falha ao criar cache para ${provider}:`, e);
      return null;
    }
  }

  private async hashString(str: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const promptCacheManager = PromptCacheManager.getInstance();
