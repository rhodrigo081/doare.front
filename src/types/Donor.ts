export const degrees = {
  apprentice: "Aprendiz",
  companion: "Companheiro",
  master: "Mestre",
  masterInstalled: "Mestre Instalado",
} as const;
export type Degree = (typeof degrees)[keyof typeof degrees];

export type Donor = {
  id: string;
  name: string;
  cpf: string;
  cim: string;
  degree: Degree;
  profession?: string;
  birthdayDate?: Date;
  lastUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type DonorRes = {
  currentPage: number;
  partners: Donor[];
  limit: number;
  totalPages: number;
  totalResults: number;
};
