import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { UserStore } from "@/zustand/user";
import { toast } from "react-toastify";
import { LoaderCircle } from "lucide-react";

export const AuthProvider = () => {
  const [loading, setLoading] = useState(true);
  const setUser = UserStore((s) => s.setUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/verify-token`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error();

        const user = await res.json();
        setUser(user.user);

        if (location.pathname === "/login") {
          navigate("/dashboard");
        }
      } catch {
        if (location.pathname !== "/login") {
          toast.error("Sessão expirada.");
          return navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [location.pathname, navigate, setUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return <Outlet />;
};
