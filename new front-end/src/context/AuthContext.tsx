import React, { createContext, useContext, useState } from "react";

type User = { name: string; role: "admin" | "landowner" | "parkingCoordinator" };
type AuthContextType = { user: User | null; setUser: (u: User | null) => void };

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
