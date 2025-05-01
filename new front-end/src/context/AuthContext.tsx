// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Define allowed roles
export type UserRole = "user" | "admin" | "landowner" | "parking coordinator";

// Define user type
export type AuthUser = {
  username: string;
  role: UserRole;
  token: string;
};

// Context type
type AuthContextType = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role to dashboard path mapping
const roleDashboardMap: Record<UserRole, string> = {
  user: "/dashboard/user",
  admin: "/dashboard/admin",
  landowner: "/dashboard/landowner",
  "parking coordinator": "/dashboard/parking-coordinator",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Restore from localStorage if available
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  // Persist user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  // Login function
  const login = async (username: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.message === "Enter OTP") {
      // Handle 2FA in your LoginForm, not here
      navigate(`/otp?userId=${data.userId}`);
      return;
    }

    // Save user info and redirect by role
    const authUser: AuthUser = {
      username,
      role: data.role,
      token: data.token,
    };
    setUser(authUser);
    localStorage.setItem("token", data.token);

    // Redirect to role-based dashboard
    if (roleDashboardMap[data.role as UserRole]) {
      navigate(roleDashboardMap[data.role as UserRole]);
    } else {
      navigate("/dashboard");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use AuthContext
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
