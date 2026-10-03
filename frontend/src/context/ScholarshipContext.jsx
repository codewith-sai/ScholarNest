import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

// ============================================================
// CONTEXT
// ============================================================

const ScholarshipContext = createContext(null);

// ============================================================
// ERROR MESSAGE HELPER
// ============================================================

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

// ============================================================
// RESPONSE UNWRAPPER
// ============================================================

const unwrapResponse = (response) => {
  return response?.data?.data ?? response?.data ?? null;
};

// ============================================================
// CONVERT RESPONSE TO ARRAY
// ============================================================

const toList = (data, ...keys) => {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
};

// ============================================================
// PAGINATION
// ============================================================

const getPagination = (response, data) => {
  const pagination =
    response?.data?.pagination ??
    data?.pagination;

  if (pagination) {
    return pagination;
  }

  return {
    total: response?.data?.total ?? data?.total ?? 0,

    page:
      response?.data?.page ??
      data?.page ??
      1,

    limit:
      response?.data?.limit ??
      data?.limit ??
      12,

    totalPages:
      response?.data?.totalPages ??
      data?.totalPages ??
      1,
  };
};

// ============================================================
// COMPARE IDS
// ============================================================

const sameId = (item, id) => {
  if (!item || !id) {
    return false;
  }

  const itemId =
    item?._id ||
    item?.id ||
    item?.scholarshipId;

  return String(itemId) === String(id);
};

// ============================================================
// PROVIDER
// ============================================================

export const ScholarshipProvider = ({ children }) => {
  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [scholarships, setScholarships] = useState([]);

  const [selectedScholarship, setSelectedScholarship] =
    useState(null);

  const [savedScholarships, setSavedScholarships] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // ==========================================================
  // GET ALL SCHOLARSHIPS
  // ==========================================================

  const fetchScholarships = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          "/scholarships",
          {
            params,
          }
        );

        const data = unwrapResponse(response);

        const list = toList(
          data,
          "scholarships",
          "results",
          "items"
        );

        setScholarships(list);

        return {
          success: true,
          data: list,
          pagination: getPagination(
            response,
            data
          ),
        };
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Failed to fetch scholarships."
        );

        console.error(
          "FETCH SCHOLARSHIPS ERROR:",
          error
        );

        setError(message);

        return {
          success: false,
          data: [],
          error: message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // GET SCHOLARSHIP BY ID
  // ==========================================================

  const fetchScholarshipById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error(
            "Scholarship ID is required."
          );
        }

        const response = await api.get(
          `/scholarships/${id}`
        );

        const scholarship =
          unwrapResponse(response);

        if (!scholarship) {
          throw new Error(
            "Scholarship details were not returned."
          );
        }

        setSelectedScholarship(
          scholarship
        );

        return {
          success: true,
          data: scholarship,
        };
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Failed to fetch scholarship details."
        );

        console.error(
          "FETCH SCHOLARSHIP DETAILS ERROR:",
          error
        );

        setError(message);

        return {
          success: false,
          data: null,
          error: message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // SEARCH SCHOLARSHIPS
  // ==========================================================

  const searchScholarships = useCallback(
    async (
      query = "",
      filters = {}
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          "/scholarships/search",
          {
            params: {
              search: query,
              ...filters,
            },
          }
        );

        const data =
          unwrapResponse(response);

        const results = toList(
          data,
          "scholarships",
          "results",
          "items"
        );

        setScholarships(results);

        return {
          success: true,
          data: results,
          pagination: getPagination(
            response,
            data
          ),
        };
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Failed to search scholarships."
        );

        console.error(
          "SEARCH SCHOLARSHIPS ERROR:",
          error
        );

        setError(message);

        return {
          success: false,
          data: [],
          error: message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ==========================================================
  // SAVE SCHOLARSHIP
  // ==========================================================

  const saveScholarship = useCallback(
    async (scholarshipId) => {
      try {
        setError(null);

        if (!scholarshipId) {
          throw new Error(
            "Scholarship ID is required."
          );
        }

        const response = await api.post(
          `/scholarships/${scholarshipId}/save`
        );

        const saved =
          unwrapResponse(response);

        // If backend returns the scholarship,
        // use it. Otherwise keep a minimal ID object.
        const entry =
          saved &&
          typeof saved === "object"
            ? saved
            : {
                _id: scholarshipId,
              };

        setSavedScholarships(
          (previous) => {
            const alreadySaved =
              previous.some(
                (item) =>
                  sameId(
                    item,
                    scholarshipId
                  )
              );

            if (alreadySaved) {
              return previous;
            }

            return [
              ...previous,
              entry,
            ];
          }
        );

        return {
          success: true,
          data: saved,
        };
      } catch (error) {
        const message = getErrorMessage(
          error,
          "Failed to save scholarship."
        );

        console.error(
          "SAVE SCHOLARSHIP ERROR:",
          error
        );

        setError(message);

        return {
          success: false,
          error: message,
        };
      }
    },
    []
  );

  // ==========================================================
  // REMOVE SAVED SCHOLARSHIP
  // ==========================================================

  const removeSavedScholarship =
    useCallback(
      async (scholarshipId) => {
        try {
          setError(null);

          if (!scholarshipId) {
            throw new Error(
              "Scholarship ID is required."
            );
          }

          const response =
            await api.delete(
              `/scholarships/${scholarshipId}/save`
            );

          setSavedScholarships(
            (previous) =>
              previous.filter(
                (item) =>
                  !sameId(
                    item,
                    scholarshipId
                  )
              )
          );

          return {
            success: true,
            data: response?.data,
          };
        } catch (error) {
          const message =
            getErrorMessage(
              error,
              "Failed to remove saved scholarship."
            );

          console.error(
            "REMOVE SAVED SCHOLARSHIP ERROR:",
            error
          );

          setError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      []
    );

  // ==========================================================
  // GET SAVED SCHOLARSHIPS
  // ==========================================================

  const fetchSavedScholarships =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await api.get(
            "/scholarships/saved"
          );

        const data =
          unwrapResponse(response);

        const list = toList(
          data,
          "scholarships",
          "savedScholarships",
          "results",
          "items"
        );

        setSavedScholarships(list);

        return {
          success: true,
          data: list,
        };
      } catch (error) {
        const message =
          getErrorMessage(
            error,
            "Failed to fetch saved scholarships."
          );

        console.error(
          "FETCH SAVED SCHOLARSHIPS ERROR:",
          error
        );

        setError(message);

        return {
          success: false,
          data: [],
          error: message,
        };
      } finally {
        setLoading(false);
      }
    }, []);

  // ==========================================================
  // CHECK IF SCHOLARSHIP IS SAVED
  // ==========================================================

  const isScholarshipSaved =
    useCallback(
      (scholarshipId) => {
        if (!scholarshipId) {
          return false;
        }

        return savedScholarships.some(
          (item) =>
            sameId(
              item,
              scholarshipId
            )
        );
      },
      [savedScholarships]
    );

  // ==========================================================
  // CLEAR SELECTED SCHOLARSHIP
  // ==========================================================

  const clearSelectedScholarship =
    useCallback(() => {
      setSelectedScholarship(null);
    }, []);

  // ==========================================================
  // CLEAR SCHOLARSHIPS
  // ==========================================================

  const clearScholarships =
    useCallback(() => {
      setScholarships([]);
    }, []);

  // ==========================================================
  // CLEAR SAVED SCHOLARSHIPS
  // ==========================================================

  const clearSavedScholarships =
    useCallback(() => {
      setSavedScholarships([]);
    }, []);

  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  const clearError =
    useCallback(() => {
      setError(null);
    }, []);

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value = useMemo(
    () => ({
      // State
      scholarships,
      selectedScholarship,
      savedScholarships,
      loading,
      error,

      // Fetch
      fetchScholarships,
      fetchScholarshipById,
      searchScholarships,
      fetchSavedScholarships,

      // Save / Remove
      saveScholarship,
      removeSavedScholarship,
      isScholarshipSaved,

      // Clear
      clearSelectedScholarship,
      clearScholarships,
      clearSavedScholarships,
      clearError,
    }),
    [
      scholarships,
      selectedScholarship,
      savedScholarships,
      loading,
      error,

      fetchScholarships,
      fetchScholarshipById,
      searchScholarships,
      fetchSavedScholarships,

      saveScholarship,
      removeSavedScholarship,
      isScholarshipSaved,

      clearSelectedScholarship,
      clearScholarships,
      clearSavedScholarships,
      clearError,
    ]
  );

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <ScholarshipContext.Provider
      value={value}
    >
      {children}
    </ScholarshipContext.Provider>
  );
};

// ============================================================
// CUSTOM HOOK
// ============================================================

export const useScholarship = () => {
  const context =
    useContext(
      ScholarshipContext
    );

  if (!context) {
    throw new Error(
      "useScholarship must be used inside a ScholarshipProvider"
    );
  }

  return context;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default ScholarshipContext;