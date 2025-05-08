import { cacheService } from "@/services/cache";
import { ExtractedPropertyData } from "@/types/property";

describe("CacheService", () => {
  beforeEach(() => {
    cacheService.clear();
  });

  const mockData: ExtractedPropertyData = {
    propertyType: "apartment",
    address: "Rua Teste, 123",
    documents: [
      {
        url: "https://example.com/doc1.pdf",
        type: "pdf",
        name: "Documento 1"
      }
    ]
  };

  it("should store and retrieve data", () => {
    const key = "test-key";
    cacheService.set(key, mockData);
    const retrieved = cacheService.get(key);
    expect(retrieved).toEqual(mockData);
  });

  it("should return null for non-existent key", () => {
    const retrieved = cacheService.get("non-existent");
    expect(retrieved).toBeNull();
  });

  it("should clear all data", () => {
    cacheService.set("key1", mockData);
    cacheService.set("key2", mockData);
    cacheService.clear();
    expect(cacheService.get("key1")).toBeNull();
    expect(cacheService.get("key2")).toBeNull();
  });

  it("should remove specific key", () => {
    cacheService.set("key1", mockData);
    cacheService.set("key2", mockData);
    cacheService.remove("key1");
    expect(cacheService.get("key1")).toBeNull();
    expect(cacheService.get("key2")).toEqual(mockData);
  });

  it("should expire data after TTL", async () => {
    const shortTTL = 100; // 100ms
    cacheService.set("key", mockData, shortTTL);
    expect(cacheService.get("key")).toEqual(mockData);
    await new Promise(resolve => setTimeout(resolve, shortTTL + 50));
    expect(cacheService.get("key")).toBeNull();
  });
}); 