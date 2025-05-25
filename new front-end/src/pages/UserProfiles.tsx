import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { fetchUserProfile } from "../services/userProfileService";
import { useUser } from "../context/UserContext";

// Import the UserProfile type from the service
import type { UserProfile } from "../services/userProfileService";

export default function UserProfiles() {
  const { user, loading: userLoading } = useUser();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserProfile = async () => {
    if (!user || !user._id) {
      // Only set error if user context is done loading
      if (!userLoading) {
        console.log('User not authenticated:', user);
        setError("User not authenticated");
        setLoading(false);
      }
      return;
    }
    try {
      console.log('Loading user profile...');
      const data = await fetchUserProfile(user._id);
      console.log('User profile loaded:', data);
      setUserData(data);
    } catch (err) {
      console.error('Error loading user profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      loadUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user._id, userLoading]);

  const handleProfileUpdate = (updatedData: UserProfile) => {
    setUserData(updatedData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">No user data available</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard userData={userData} onUpdate={handleProfileUpdate} />
          <UserInfoCard userData={userData} onUpdate={handleProfileUpdate} />
          <UserAddressCard userData={userData} onUpdate={handleProfileUpdate} />
        </div>
      </div>
    </>
  );
}
