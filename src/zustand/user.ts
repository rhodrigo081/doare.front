import type { User } from "@/types/User";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";
import { create } from "zustand";

type UserStore = {
  user: User | undefined;
  setUser: (user: User) => void;
  logout: (navigate: (path: string) => void) => void;
};

export const UserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  logout: async (navigate: (path: string) => void) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new AppError("Falha no logout");
      }
      set({ user: undefined });

      toast.success("Sessão encerrada com sucesso.");

      navigate("/login");
    } catch (err) {
      if (err instanceof AppError) {
        return toast.error(err.message);
      }
      return toast.error("Ocorreu um erro ao sair.");
    }
  },
}));
