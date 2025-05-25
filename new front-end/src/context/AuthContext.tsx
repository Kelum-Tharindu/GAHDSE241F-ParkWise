// // src/context/AuthContext.tsx
// import React, { createContext, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";

// interface AuthContextProps {
//   user: { role: string } | null;
//   login: (userData: { role: string }) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<{ role: string } | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // On mount, validate token with backend
//     const validate = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/auth/validate-token", {
//           method: "POST",
//           credentials: "include",
//         });
//         if (!res.ok) {
//           setUser(null);
//           // Only redirect if not already on login page
//           if (window.location.pathname !== "/login") {
//             navigate("/login");
//           }
//           return;
//         }
//         const data = await res.json();
//         setUser(data.user);
//       } catch {
//         setUser(null);
//         if (window.location.pathname !== "/login") {
//           navigate("/login");
//         }
//       }
//     };
//     validate();
//     // eslint-disable-next-line
//   }, []);

//   const login = (userData: { role: string }) => {
//     setUser(userData);
//     // No localStorage, rely on backend cookie
//     // Redirect based on role
//     switch (userData.role) {
//       case "admin":
//         navigate("/dashboard/admin");
//         break;
//       case "landowner":
//         navigate("/dashboard/landowner");
//         break;
//       case "parking coordinator":
//         navigate("/dashboard/parking-coordinator");
//         break;
//       case "user":
//         navigate("/dashboard/user");
//         break;
//       default:
//         navigate("/dashboard");
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
