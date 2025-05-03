import { validateUrl, isSecureUrl, validateDocumentUrl } from "@/utils/urlValidator";

describe("URL Validator", () => {
  describe("validateUrl", () => {
    it("should validate correct URLs", () => {
      const result = validateUrl("https://example.com");
      expect(result.isValid).toBe(true);
    });

    it("should reject invalid URLs", () => {
      const result = validateUrl("not-a-url");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("isSecureUrl", () => {
    it("should accept HTTPS URLs", () => {
      expect(isSecureUrl("https://example.com")).toBe(true);
    });

    it("should reject HTTP URLs", () => {
      expect(isSecureUrl("http://example.com")).toBe(false);
    });

    it("should reject invalid URLs", () => {
      expect(isSecureUrl("not-a-url")).toBe(false);
    });
  });

  describe("validateDocumentUrl", () => {
    it("should validate correct document URLs", async () => {
      const result = await validateDocumentUrl("https://example.com/document.pdf");
      expect(result.isValid).toBe(true);
    });

    it("should reject HTTP URLs", async () => {
      const result = await validateDocumentUrl("http://example.com/document.pdf");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("URL deve usar HTTPS");
    });

    it("should reject invalid URLs", async () => {
      const result = await validateDocumentUrl("not-a-url");
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
}); 