import { degrees, type Degree } from "@/types/Donor";
import { today } from "@/utils/today";
import { cpf } from "cpf-cnpj-validator";
import z from "zod";

export const addDonorSchema = z.object({
  name: z
    .string()
    .nonempty("O Nome é obrigatório")
    .min(3, "O Nome precisa ter pelo menos 3 caracteres")
    .max(100, "O Nome não pode ter mais de 100 caracteres"),
  cpf: z
    .string()
    .min(1, "O CPF é obrigatório")
    .refine((CPFvalue) => cpf.isValid(CPFvalue), {
      message: "Digite um CPF válido",
    }),
  cim: z
    .string()
    .nonempty("O código CIM é obrigatório")
    .min(4, "o código CIM deve ter pelo menos 4 caracteres")
    .max(4, "O código CIM não pode ter mais de 4 caracteres"),
  degree: z.enum(Object.values(degrees) as [Degree, ...Degree[]], {
    message:
      "O Grau precisa ser: Aprendiz, Companheiro, Mestre ou Mestre Instalado",
  }),
  profession: z
    .string()
    .max(50, "A profissão não pode ter mais de 50 caracteres")
    .optional(),
  birthdayDate: z
    .date({ message: "A data de nascimento precisa ser válida" })
    .refine((date) => date <= today, {
      message: "Data de nascimento não pode ser futura",
    })
    .optional(),
});

export type AddDonorFormData = z.infer<typeof addDonorSchema>;
