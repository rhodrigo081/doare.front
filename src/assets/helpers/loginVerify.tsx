import { AppError } from "@/utils/AppError";

export const loginVerify = (
  res: Response,
  navigate: (path: string) => void
) => {
  if (res.status === 401) {
    navigate("/login");
    throw new AppError("Sessão expirada, por favor faça login novamente.");
  }
};
