import { validateUrl, isSecureUrl, validateDocumentUrl } from "@/utils/urlValidator";
import { validatePropertyUrl } from "@/utils/validators";

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

  describe("validatePropertyUrl", () => {
    it("deve aceitar URLs válidas de domínio .com.br", () => {
      expect(validatePropertyUrl("https://www.megaleiloes.com.br/imovel/12345")).toBe(true);
      expect(validatePropertyUrl("http://portalzuk.com.br/imovel/abcde")).toBe(true);
      expect(validatePropertyUrl("https://imoveis.caixa.gov.br/imovel/xyz")).toBe(true);
    });

    it("deve aceitar URLs válidas de domínio .gov.br", () => {
      expect(validatePropertyUrl("https://venda-imoveis.caixa.gov.br/imovel/12345")).toBe(true);
      expect(validatePropertyUrl("http://outro.gov.br/imovel/abcde")).toBe(true);
    });

    it("deve rejeitar URLs inválidas ou de domínios não permitidos", () => {
      expect(validatePropertyUrl("https://example.com/imovel/12345")).toBe(false);
      expect(validatePropertyUrl("https://site.com/imovel/abcde")).toBe(false);
      expect(validatePropertyUrl("ftp://megaleiloes.com.br/imovel/12345")).toBe(false);
      expect(validatePropertyUrl("http://site.org/imovel/xyz")).toBe(false);
      expect(validatePropertyUrl("not-a-url")).toBe(false);
    });
  });
}); 