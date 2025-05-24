import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      try {
        console.log("[ProtectedRoute] Validating token and role...");
        const res = await fetch("http://localhost:5000/api/auth/validate-token", {
          method: "POST",
          credentials: "include",
        });
        console.log("[==ProtectedRoute] Response status:", res.status);
        if (!res.ok) {
          console.log("[ProtectedRoute] Token invalid or missing. Redirecting to login.");
          navigate("/");
          return;
        }
        const data = await res.json();
        console.log("[ProtectedRoute] User data:", data.user);
        if (data.user.role !== requiredRole) {
          console.log(`[ProtectedRoute] Role mismatch. Required: ${requiredRole}, Actual: ${data.user.role}. Redirecting to NotFound.`);
          navigate("/pages/OtherPage/NotFound");
        }
      } catch (err) {
        console.log("[ProtectedRoute] Error during validation:", err);
        navigate("/");
      }
    };
    validate();
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
}
