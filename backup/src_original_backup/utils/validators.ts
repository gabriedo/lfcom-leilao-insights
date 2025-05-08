export const validatePropertyUrl = (url: string): boolean => {
  // Regex para validar URLs de qualquer domínio com .com.br ou .gov.br
  const propertyUrlRegex = /^https?:\/\/[^ ]+\.(com\.br|gov\.br)(\/.*)?$/i;
  return propertyUrlRegex.test(url);
};

export const getUrlErrorMessage = (url: string): string | null => {
  if (!url) return null;
  
  if (!url.startsWith('http')) {
    return 'A URL deve começar com http:// ou https://';
  }
  
  if (!/^https?:\/\/[^ ]+\.(com\.br|gov\.br)(\/.*)?$/i.test(url)) {
    return 'A URL deve ser de um domínio válido (ex: .com.br ou .gov.br)';
  }
  
  return null;
}; 