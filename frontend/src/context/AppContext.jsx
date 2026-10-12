import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  // -----------------------------
  // Network status
  // -----------------------------
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // -----------------------------
  // Start global loading
  // -----------------------------
  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  // -----------------------------
  // Stop global loading
  // -----------------------------
  const stopLoading = () => {
    setLoading(false);
  };

  // -----------------------------
  // Set application error
  // -----------------------------
  const setAppError = (message) => {
    setError(message || "Something went wrong.");
    setLoading(false);
  };

  // -----------------------------
  // Clear application error
  // -----------------------------
  const clearError = () => {
    setError(null);
  };

  // -----------------------------
  // Execute async operation
  // -----------------------------
  const execute = async (asyncFunction) => {
    try {
      startLoading();

      const result = await asyncFunction();

      stopLoading();

      return {
        success: true,
        data: result,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong.";

      setAppError(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // -----------------------------
  // Context value
  // -----------------------------
  const value = {
    loading,
    error,
    isOnline,

    startLoading,
    stopLoading,

    setAppError,
    clearError,

    execute,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// -----------------------------
// Custom hook
// -----------------------------
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used inside an AppProvider"
    );
  }

  return context;
};

export default AppContext;
