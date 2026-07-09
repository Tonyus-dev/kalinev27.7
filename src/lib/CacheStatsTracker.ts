export type CacheType = 'prompt_gemini' | 'prompt_openrouter' | 'semantic';

export interface CacheStats {
  hits: number;
  misses: number;
  lastHitAt: number | null;
  lastMissAt: number | null;
  estimatedSavingsUsd: number;
}

class CacheStatsTracker {
  private static instance: CacheStatsTracker;
  private stats: Record<CacheType, CacheStats> = {
    prompt_gemini: { hits: 0, misses: 0, lastHitAt: null, lastMissAt: null, estimatedSavingsUsd: 0 },
    prompt_openrouter: { hits: 0, misses: 0, lastHitAt: null, lastMissAt: null, estimatedSavingsUsd: 0 },
    semantic: { hits: 0, misses: 0, lastHitAt: null, lastMissAt: null, estimatedSavingsUsd: 0 },
  };

  private listeners: (() => void)[] = [];

  private constructor() {
    this.loadStats();
  }

  static getInstance() {
    if (!CacheStatsTracker.instance) {
      CacheStatsTracker.instance = new CacheStatsTracker();
    }
    return CacheStatsTracker.instance;
  }

  private loadStats() {
    try {
      const stored = localStorage.getItem('kaline_cache_stats');
      if (stored) {
        this.stats = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load cache stats', e);
    }
  }

  private saveStats() {
    localStorage.setItem('kaline_cache_stats', JSON.stringify(this.stats));
    this.notifyListeners();
  }

  recordHit(type: CacheType, savingsEstUsd: number = 0.0001) {
    this.stats[type].hits++;
    this.stats[type].lastHitAt = Date.now();
    this.stats[type].estimatedSavingsUsd += savingsEstUsd;
    this.saveStats();
  }

  recordMiss(type: CacheType) {
    this.stats[type].misses++;
    this.stats[type].lastMissAt = Date.now();
    this.saveStats();
  }

  getStats() {
    return this.stats;
  }

  resetStats() {
    this.stats = {
      prompt_gemini: { hits: 0, misses: 0, lastHitAt: null, lastMissAt: null, estimatedSavingsUsd: 0 },
      prompt_openrouter: { hits: 0, misses: 0, lastHitAt: null, lastMissAt: null, estimatedSavingsUsd: 0 },
      semantic: { hits: 0, misses: 0, lastHitAt: null, lastMissAt: null, estimatedSavingsUsd: 0 },
    };
    this.saveStats();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(l => l());
  }
}

export const cacheStatsTracker = CacheStatsTracker.getInstance();
