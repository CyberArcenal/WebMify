// src/js/utils/authStore.js
class AuthStore {
  constructor() {
    this.STORAGE_KEY = "dariusportfolio_auth_store";
    this.ACCESS_TOKEN_KEY = "dariusportfolio_access_token";
    this.REFRESH_TOKEN_KEY = "dariusportfolio_refresh_token";
    this.USER_DATA_KEY = "dariusportfolio_user_data";
    this.TOKEN_EXPIRATION_KEY = "dariusportfolio_token_expiration";
}
  // Main authentication methods
  setAuthData = ({ user, accessToken, refreshToken, expiresIn }) => {
    try {
      const expirationTime = Date.now() + expiresIn * 1000;

      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationTime.toString());

      return true;
    } catch (error) {
      console.error("Error saving auth data:", error);
      return false;
    }
  };

  // Retrieve current authentication state
  getState = () => {
    return {
      user: this.getUser(),
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      isAuthenticated: this.isAuthenticated(),
    };
  };

  getAccessToken = () => {
    if (this.isTokenExpired()) {
      this.clearAuth();
      return null;
    }
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  };

  getRefreshToken = () => {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  };

  getUser = () => {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  };

  isAuthenticated = () => {
    return !!this.getAccessToken();
  };

  // Token expiration check
  isTokenExpired = () => {
    const expirationTime = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
    if (!expirationTime || isNaN(expirationTime)) return true; // Ensure valid expiration value
    return Date.now() > parseInt(expirationTime, 10);
  };

  // Refresh token mechanism
  refreshToken = async () => {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");

      // Replace with actual API call
      const response = await fetch("/api/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Token refresh failed");

      const { accessToken, refreshToken: newRefreshToken, expiresIn } = await response.json();
      this.updateAccessToken(accessToken, newRefreshToken, expiresIn);
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.clearAuth();
      return false;
    }
  };

  // Update token details
  updateAccessToken = (newToken, newRefresh, expiresIn) => {
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, newToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, newRefresh);
    localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationTime.toString());
  };

  // Clear authentication data
  clearAuth = () => {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
  };

  // Session synchronization across tabs/windows
  subscribe = (callback) => {
    window.addEventListener("storage", (e) => {
      if (
        e.key === this.ACCESS_TOKEN_KEY ||
        e.key === this.TOKEN_EXPIRATION_KEY
      ) {
        callback(this.isAuthenticated());
      }
    });
  };
}

// Export singleton instance
export const authStore = new AuthStore();
