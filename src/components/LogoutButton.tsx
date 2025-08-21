import { UserStore } from "@/zustand/user";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";

const LogoutButton = () => {
  const logout = UserStore((state) => state.logout);
  const [isLoading, setIsloading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsloading(true);
    await logout(navigate);
    setIsloading(false);
  };
  return (
    <div
      className="text-black cursor-pointer p-3 bg-gray-50 hover:bg-gray-100  rounded-lg transition-all ml-3 flex-shrink-0"
      onClick={handleLogout}
      title="Sair"
    >
      {isLoading ? (
        <LoaderCircle className="text-black animate-spin" />
      ) : (
        <LogOut />
      )}
    </div>
  );
};

export default LogoutButton;
