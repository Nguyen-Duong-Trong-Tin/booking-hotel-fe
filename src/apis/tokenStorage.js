const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";

const getFromStorage = (key) =>
  sessionStorage.getItem(key) || localStorage.getItem(key);

const getPreferredStorage = () => {
  if (
    sessionStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  ) {
    return sessionStorage;
  }

  if (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    localStorage.getItem(ACCESS_TOKEN_KEY)
  ) {
    return localStorage;
  }

  return localStorage;
};

export const getAccessToken = () => getFromStorage(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => getFromStorage(REFRESH_TOKEN_KEY);

export const setTokens = ({ accessToken, refreshToken, remember }) => {
  const storage = remember ? localStorage : sessionStorage;

  clearTokens();

  if (accessToken) {
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const setAccessToken = (accessToken) => {
  if (!accessToken) {
    return;
  }

  const storage = getPreferredStorage();
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

export const clearTokens = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
