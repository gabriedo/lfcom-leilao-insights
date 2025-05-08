import { ExtractedPropertyData } from "@/types/property";

interface CacheEntry {
  data: ExtractedPropertyData;
  timestamp: number;
  expiresAt: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheEntry>;
  private readonly DEFAULT_TTL = 1000 * 60 * 60; // 1 hora em milissegundos

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set(key: string, data: ExtractedPropertyData, ttl: number = this.DEFAULT_TTL): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
  }

  public get(key: string): ExtractedPropertyData | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  public clear(): void {
    this.cache.clear();
  }

  public remove(key: string): void {
    this.cache.delete(key);
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = CacheService.getInstance(); 