import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  _id: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  country: string | null;
  city: string | null;
  postalCode: string | null;
  taxId: string | null;
  socialLinks: {
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    instagram: string | null;
  };
  is2FAEnabled?: boolean;
};

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    _id: null,
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    role: null,
    country: null,
    city: null,
    postalCode: null,
    taxId: null,
    socialLinks: {
      facebook: null,
      twitter: null,
      linkedin: null,
      instagram: null,
    },
    is2FAEnabled: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/validate-token", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        const backendUser = data.user;
        setUser({
          _id: backendUser._id || null,
          username: backendUser.username || null,
          firstName: backendUser.firstName || null,
          lastName: backendUser.lastName || null,
          email: backendUser.email || null,
          phone: backendUser.phone || null,
          role: backendUser.role || null,
          country: backendUser.country || null,
          city: backendUser.city || null,
          postalCode: backendUser.postalCode || null,
          taxId: backendUser.taxId || null,
          socialLinks: backendUser.socialLinks || {
            facebook: null,
            twitter: null,
            linkedin: null,
            instagram: null,
          },
          is2FAEnabled: backendUser.is2FAEnabled ?? false,
        });
      } catch {
        setUser({
          _id: null,
          username: null,
          firstName: null,
          lastName: null,
          email: null,
          phone: null,
          role: null,
          country: null,
          city: null,
          postalCode: null,
          taxId: null,
          socialLinks: {
            facebook: null,
            twitter: null,
            linkedin: null,
            instagram: null,
          },
          is2FAEnabled: false,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
