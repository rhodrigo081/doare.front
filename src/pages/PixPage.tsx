import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Imagens
import logo_unica from "@/assets/22ae72c2-d56e-4002-9acf-fe41d79a1f45-removebg-preview.png";

// shadcn/ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Ícones do Lucide
import { Check, CircleDollarSign, IdCard, LoaderCircle, X } from "lucide-react";
import { AppError } from "@/utils/AppError";
import { pixStore } from "@/zustand/pixStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { NumericFormat, PatternFormat } from "react-number-format";
import { cpf } from "cpf-cnpj-validator";

// Esquema de validação
const formSchema = z.object({
  cpf: z
    .string({ message: "O CPF é obrigatório!" })
    .length(11, "O CPF deve ter 11 caracteres!")
    .refine((arg) => cpf.isValid(arg), "CPF inválido!"),
  valor: z
    .number({ message: "O valor é obrigatório!" })
    // .min(1, "O valor deve ser maior ou igual a R$1,00")
    .max(500000, "O valor deve ser menor que R$500.000,00"),
});

type FormData = z.infer<typeof formSchema>;

const PixPage: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [isValidDonor, setIsValidDonor] = useState<boolean | undefined>(
    undefined
  );
  const [isLodingDonor, setIsLoadingDonor] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const cpfField = watch("cpf");

  const verifyDonorExist = useCallback(async () => {
    try {
      setIsLoadingDonor(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/parceiros/cpf/${cpfField}`
      );

      if (!res.ok) {
        throw new AppError("Erro na requisição");
      }

      if ((await res.json()) === null) {
        throw new Error();
      }
      setIsValidDonor(true);
      clearErrors();
    } catch (err: unknown) {
      if (err instanceof AppError) {
        toast.error("Ocorreu um erro na requisição");
        setError("cpf", { message: "Ocorreu um erro" });
        return;
      }
      setError("cpf", {
        message: "Este CPF não está registrado no nosso sistema",
      });
    } finally {
      setIsLoadingDonor(false);
    }
  }, [setIsValidDonor, clearErrors, cpfField, setError]);

  useEffect(() => {
    if (!cpfField) {
      setIsValidDonor(undefined);
      clearErrors("cpf");
      return;
    }

    if (!cpf.isValid(cpfField) && cpfField.length >= 11) {
      setIsValidDonor(false);
      return;
    }

    if (cpf.isValid(cpfField)) {
      verifyDonorExist();
    }
  }, [cpfField, clearErrors, verifyDonorExist]);

  const setPix = pixStore((state) => state.setPix);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoadingSubmit(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/doacoes/gerar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ donorCPF: data.cpf, amount: data.valor }),
        }
      );

      console.log(res.status);

      if (res.status === 404) {
        throw new AppError("Doador não encontrado!");
      }

      if (!res.ok) {
        throw new AppError("Ocorreu um erro ao gerar o código PIX!");
      }

      const pixData = await res.json();
      console.log(pixData);

      setPix(pixData);
      navigate("/pixPayment");
    } catch (err) {
      if (err instanceof AppError) {
        toast.error(err.message);
      }
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-[#E6E6E6] p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 text-center"
      >
        {/* Logo */}
        <img
          src={logo_unica}
          alt="Logo Doa.re"
          className="mx-auto w-25 mt-4 mb-3"
        />

        {/* Faixa verde */}
        <div className="-mx-6 mt-[30px] mb-6">
          <div className="h-[9px] w-full bg-[#0310FF]" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Doar</h2>

        {/* CPF com ícone */}
        <div className="mb-4 text-left">
          <label className="text-sm text-gray-700 font-medium mb-1 block">
            CPF
          </label>
          <div className="relative">
            <IdCard
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <PatternFormat
                  format="###.###.###-##"
                  customInput={Input}
                  className="pl-10"
                  placeholder="345.345.345-34"
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    field.onChange(value);
                  }}
                />
              )}
            />
            {isLodingDonor ? (
              <LoaderCircle className="animate-spin absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            ) : isValidDonor === true ? (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            ) : isValidDonor === false ? (
              <X className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
            ) : null}
          </div>
          {errors.cpf && (
            <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>
          )}
        </div>

        {/* Valor com ícone */}
        <div className="mb-6 text-left">
          <label className="text-sm text-gray-700 font-medium mb-1 block">
            Valor
          </label>
          <div className="relative">
            <CircleDollarSign
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Controller
              name="valor"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                  isAllowed={({ floatValue }) => {
                    return (floatValue ?? 0) <= 500000;
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  prefix="R$ "
                  customInput={Input}
                  className="pl-10"
                  placeholder="R$ 0,00"
                />
              )}
            />
          </div>
          {errors.valor && (
            <p className="text-red-500 text-xs mt-1">{errors.valor.message}</p>
          )}
        </div>

        {/* Botão */}
        <Button
          type="submit"
          variant="secondary"
          disabled={isLoadingSubmit || !isValidDonor}
          className="w-full mt-4  text-white font-semibold py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          Gerar PIX
          {isLoadingSubmit && <LoaderCircle className="animate-spin" />}
        </Button>
      </form>
    </div>
  );
};

export default PixPage;
