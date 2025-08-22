import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// Imagens
import logo from "@/assets/22ae72c2-d56e-4002-9acf-fe41d79a1f45-removebg-preview.png";
import logo2 from "../assets/NAME-1.svg";
import logo3_mobile from "@/assets/22ae72c2-d56e-4002-9acf-fe41d79a1f45-removebg-preview.png";
import handsBackground from "../assets/maos-dadas-umas-as-outras-para-apoio 1 (1).svg";

// Ícones
import { UserRound, Eye, EyeOff, Lock, LoaderCircle } from "lucide-react";
import { UserStore } from "@/zustand/user";
import { toast } from "react-toastify";
import { AppError } from "@/utils/AppError";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  usuario: z.string().min(3, "Usuário deve ter pelo menos 3 caracteres"),
  senha: z.string().min(3, "Senha deve ter pelo menos 3 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = UserStore((state) => state.setUser);
  const user = UserStore((state) => state.user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: data.usuario,
            password: data.senha,
          }),
        }
      );

      if (!response.ok) {
        throw new AppError("Usuário ou senha incorretos.");
      }

      const result = await response.json();

      toast.success(`Login bem-sucedido! Bem-vindo(a), ${result.user.login}`);
      setUser(result.user);
      console.log(user);
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error instanceof AppError)
          return toast.error(error.message || "Erro ao fazer login.");
        return toast.error(
          "Erro ao fazer login. Por favor, tente novamente mais tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-2"
      style={{
        background: "linear-gradient(to bottom right, #FFFFFF, #E6E6E6)",
      }}
    >
      <div className="bg-white w-full max-w-[900px] rounded-xl flex flex-row overflow-hidden shadow-lg m-4">
        {/* Lado esquerdo */}
        <div
          className="hidden md:block w-1/2 px-6 py-8 p-10 flex-col justify-center items-center text-center relative"
          style={{
            backgroundImage: `url(${handsBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom right, #0310FF, #01AAFB)",
              opacity: 0.7,
            }}
          ></div>

          <img
            src={handsBackground}
            alt="Mãos dadas"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />

          <div className="relative z-10 text-white">
            <img
              src={logo2}
              alt="Logo Desktop"
              className="w-60 mx-auto mb-4 -mt-[30px]"
            />
            <p className="mb-6 text-white text-center font-semibold max-w-xs sm:max-w-md mx-auto text-base sm:text-xl leading-snug">
              Transforme generosidade em impacto. <br />
              Doe e faça a diferença!
            </p>
            <img
              src={logo}
              alt="Logo Coração"
              className="w-40 sm:w-60 mx-auto mb-3"
            />
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full md:w-1/2 px-6 p-10 py-[85px]">
          <img
            src={logo3_mobile}
            alt="Logo Mobile"
            className="w-72 mx-auto mb-0 mt-[-60px] md:hidden"
          />
          <div className="w-auto h-2.5 bg-[#007268] mb-6 -mt-[-30px] mx-[-24px] md:hidden"></div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Usuário */}
            <div>
              <label
                htmlFor="usuario"
                className="text-sm md:font-semibold block mb-1"
              >
                Usuário
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                <UserRound className="text-gray-400 mr-2" size={18} />
                <input
                  id="usuario"
                  type="text"
                  placeholder="Digite seu usuário"
                  {...register("usuario")}
                  className="flex-1 outline-none placeholder-opacity-50 placeholder-gray-500 text-sm"
                />
              </div>
              {errors.usuario && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.usuario.message}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="senha"
                className="text-sm md:font-semibold block mb-1"
              >
                Senha
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2">
                <Lock className="text-gray-400" size={18} />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  {...register("senha")}
                  className="flex-1 min-w-0 outline-none placeholder-opacity-50 placeholder-gray-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="text-gray-500 hover:text-gray-700"
                  title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.senha.message}
                </p>
              )}
            </div>

            {/* Botão de envio */}
            <Button
              variant={"secondary"}
              type="submit"
              className="text-white mt-4"
            >
              Entrar {loading && <LoaderCircle className="animate-spin" />}
            </Button>
          </form>
        </div>
      </div>

      <footer className="mt-6 text-center text-sm text-foreground/70">
        © 2025 Lummi. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default Login;
