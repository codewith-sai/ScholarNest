import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const ProfileContext = createContext(null);

export const ProfileProvider = ({
  children,
}) => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(
        "/profile"
      );

      const data =
        response.data?.profile ||
        response.data?.data ||
        response.data?.user ||
        response.data;

      if (!data) {
        throw new Error(
          "Profile data not found."
        );
      }

      setProfile(data);

      return data;
    } catch (error) {
      console.error(
        "FETCH PROFILE ERROR:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to load profile.";

      setError(message);

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const updateProfile = useCallback(
    async (profileData) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.put(
          "/profile",
          profileData
        );

        const updatedProfile =
          response.data?.profile ||
          response.data?.data ||
          response.data?.user ||
          response.data;

        setProfile(updatedProfile);

        return updatedProfile;
      } catch (error) {
        console.error(
          "UPDATE PROFILE ERROR:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to update profile.";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // =====================================================
  // UPDATE PROFILE IMAGE
  // =====================================================

  const updateProfileImage =
    useCallback(async (file) => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();

        formData.append(
          "profileImage",
          file
        );

        const response = await api.put(
          "/profile/image",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        const updatedProfile =
          response.data?.profile ||
          response.data?.data ||
          response.data?.user ||
          response.data;

        setProfile(updatedProfile);

        return updatedProfile;
      } catch (error) {
        console.error(
          "UPDATE PROFILE IMAGE ERROR:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to update profile image.";

        setError(message);

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  // =====================================================
  // CLEAR PROFILE
  // =====================================================

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,

      fetchProfile,
      updateProfile,
      updateProfileImage,

      clearProfile,
      clearError,
    }),
    [
      profile,
      loading,
      error,

      fetchProfile,
      updateProfile,
      updateProfileImage,

      clearProfile,
      clearError,
    ]
  );

  return (
    <ProfileContext.Provider
      value={value}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// =====================================================
// HOOK
// =====================================================

export const useProfile = () => {
  const context =
    useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside a ProfileProvider"
    );
  }

  return context;
};

export default ProfileContext;