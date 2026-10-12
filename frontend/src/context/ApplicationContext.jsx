import { createContext, useCallback, useContext, useState } from "react";
import api from "../services/api";

const ApplicationContext = createContext(null);

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all applications
  const fetchApplications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/applications", {
        params,
      });

      const data = response?.data?.data ?? response?.data;

      const applicationList = Array.isArray(data)
        ? data
        : data?.applications || [];

      setApplications(applicationList);

      return {
        success: true,
        data: applicationList,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch applications.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single application
  const fetchApplicationById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        throw new Error("Application ID is required.");
      }

      const response = await api.get(`/applications/${id}`);

      const application =
        response?.data?.data ?? response?.data;

      setSelectedApplication(application);

      return {
        success: true,
        data: application,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch application details.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Apply for a scholarship
  const applyForScholarship = async (
    scholarshipId,
    applicationData = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!scholarshipId) {
        throw new Error("Scholarship ID is required.");
      }

      const response = await api.post(
        `/scholarships/${scholarshipId}/apply`,
        applicationData
      );

      const application =
        response?.data?.data ?? response?.data;

      if (application) {
        setApplications((prev) => [application, ...prev]);
      }

      return {
        success: true,
        data: application,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit scholarship application.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Cancel application
  const cancelApplication = async (applicationId) => {
    try {
      setLoading(true);
      setError(null);

      if (!applicationId) {
        throw new Error("Application ID is required.");
      }

      const response = await api.patch(
        `/applications/${applicationId}/cancel`
      );

      const updatedApplication =
        response?.data?.data ?? response?.data;

      setApplications((prev) =>
        prev.map((application) => {
          const id = application?._id || application?.id;

          if (String(id) === String(applicationId)) {
            return updatedApplication || {
              ...application,
              status: "cancelled",
            };
          }

          return application;
        })
      );

      if (
        selectedApplication &&
        String(
          selectedApplication?._id || selectedApplication?.id
        ) === String(applicationId)
      ) {
        setSelectedApplication(
          updatedApplication || {
            ...selectedApplication,
            status: "cancelled",
          }
        );
      }

      return {
        success: true,
        data: updatedApplication,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to cancel application.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Update application
  const updateApplication = async (
    applicationId,
    applicationData
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!applicationId) {
        throw new Error("Application ID is required.");
      }

      const response = await api.put(
        `/applications/${applicationId}`,
        applicationData
      );

      const updatedApplication =
        response?.data?.data ?? response?.data;

      setApplications((prev) =>
        prev.map((application) => {
          const id = application?._id || application?.id;

          return String(id) === String(applicationId)
            ? updatedApplication
            : application;
        })
      );

      setSelectedApplication(updatedApplication);

      return {
        success: true,
        data: updatedApplication,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update application.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Clear selected application
  const clearSelectedApplication = () => {
    setSelectedApplication(null);
  };

  // Clear all applications
  const clearApplications = () => {
    setApplications([]);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    applications,
    selectedApplication,
    loading,
    error,

    fetchApplications,
    fetchApplicationById,
    applyForScholarship,
    cancelApplication,
    updateApplication,

    clearSelectedApplication,
    clearApplications,
    clearError,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useApplication must be used inside an ApplicationProvider"
    );
  }

  return context;
};

export default ApplicationContext;