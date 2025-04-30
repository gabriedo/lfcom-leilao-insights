export const validatePropertyUrl = (url: string): boolean => {
  // Regex para validar URLs de sites de leilão
  const propertyUrlRegex = /^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.(?:com\.br|com)\/imovel\/[a-zA-Z0-9-]+$/;
  return propertyUrlRegex.test(url);
};

export const getUrlErrorMessage = (url: string): string | null => {
  if (!url) return null;
  
  if (!url.startsWith('http')) {
    return 'A URL deve começar com http:// ou https://';
  }
  
  if (!url.includes('.com.br/imovel/') && !url.includes('.com/imovel/')) {
    return 'A URL deve ser de um site de leilão válido (ex: .com.br/imovel/)';
  }
  
  return null;
}; 