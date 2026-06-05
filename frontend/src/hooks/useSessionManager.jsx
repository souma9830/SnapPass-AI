import { useEffect, useState, useCallback } from "react";

/**
 * useSessionManager custom hook
 * Monitors authentication state and tracks token remaining life,
 * offering warnings before token expiration.
 */
export const useSessionManager = (token, onExpiryWarning, onExpired, warningThresholdMs = 60000) => {
  const [isWarningTriggered, setIsWarningTriggered] = useState(false);

  const getDecodedTokenExpiry = useCallback((t) => {
    if (!t) return null;
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      if (payload && payload.exp) {
        return payload.exp * 1000; // to ms
      }
    } catch (e) {
      console.error("Failed to parse JWT token expiration", e);
    }
    return null;
  }, []);

  useEffect(() => {
    if (!token) return;

    const expiryTime = getDecodedTokenExpiry(token);
    if (!expiryTime) return;

    const checkTokenLife = () => {
      const timeLeft = expiryTime - Date.now();

      if (timeLeft <= 0) {
        if (onExpired) onExpired();
      } else if (timeLeft <= warningThresholdMs && !isWarningTriggered) {
        setIsWarningTriggered(true);
        if (onExpiryWarning) onExpiryWarning(timeLeft);
      }
    };

    const interval = setInterval(checkTokenLife, 10000); // Check every 10 seconds
    checkTokenLife(); // Initial run

    return () => clearInterval(interval);
  }, [token, warningThresholdMs, isWarningTriggered, onExpiryWarning, onExpired, getDecodedTokenExpiry]);

  return {
    isWarningTriggered,
    resetWarning: () => setIsWarningTriggered(false),
  };
};

export default useSessionManager;
