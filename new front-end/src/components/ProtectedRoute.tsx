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
        const res = await fetch("http://localhost:5000/api/auth/validate-token", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/");
          return;
        }
        const data = await res.json();
        if (data.user.role !== requiredRole) {
          navigate("/pages/OtherPage/NotFound");
        }
      } catch {
        navigate("/");
      }
    };
    validate();
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
}
