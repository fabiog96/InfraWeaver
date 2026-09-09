const TOKEN_KEY = 'viz:github:token';

const takeLegacyLocalStorageToken = (): string | null => {
  const legacyToken = localStorage.getItem(TOKEN_KEY);
  if (legacyToken !== null) localStorage.removeItem(TOKEN_KEY);
  return legacyToken;
};

export const readToken = (): string => {
  const legacyToken = takeLegacyLocalStorageToken();
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (sessionToken !== null) return sessionToken;

  if (legacyToken !== null) sessionStorage.setItem(TOKEN_KEY, legacyToken);
  return legacyToken ?? '';
};

export const writeToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};
