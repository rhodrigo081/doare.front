import type { DonorRes } from "@/types/Donor";
import { AppError } from "@/utils/AppError";
import type { AddDonorFormData } from "@/zod/AddDonorSchema";
import type { EditDonorFormData } from "@/zod/EditDonorSchema";

import { create } from "zustand";

type DonorStore = {
  donors: DonorRes;
  setDonors: (donors: DonorRes) => void;
  addDonor: (data: AddDonorFormData) => Promise<void>;
  updateDonor: (donor: EditDonorFormData, donorId: string) => Promise<void>;
  deleteDonor: (donorsIds: string[]) => Promise<void>;
};

export const donorStore = create<DonorStore>((set, get) => ({
  donors: {
    currentPage: 1,
    partners: [],
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  },
  setDonors: (donors: DonorRes) => set({ donors }),
  addDonor: async (data: AddDonorFormData) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/parceiros/cadastrar`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 409) {
      throw new AppError("Já existe um doador cadastrado com este CPF");
    }

    if (!res.ok) {
      throw new AppError("Ocorreu um erro ao cadastrar o doador");
    }

    const newDonor = await res.json();

    const { donors } = get();
    const updatedList = [newDonor, ...donors.partners];
    set({
      donors: {
        ...donors,
        partners: updatedList,
        totalResults: donors.totalResults + 1,
      },
    });
  },
  updateDonor: async (updatedDonor: EditDonorFormData, donorId: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/parceiros/atualizar/${donorId}`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(updatedDonor),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new AppError("Ocorreu um erro ao atualizar o doador");
    }

    const newDonor = await res.json();

    const { donors } = get();
    const updatedList = donors.partners.map((donor) =>
      donor.id === newDonor.id ? newDonor : donor
    );
    set({ donors: { ...donors, partners: updatedList } });
  },
  deleteDonor: async (donorsIds: string[]) => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/parceiros/remover/`,
      {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ ids: donorsIds }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new AppError(
        `Ocorreu um erro ao remover ${
          donorsIds.length > 1 ? "os doadores" : "o doador"
        }!`
      );
    }

    const { donors } = get();
    const updatedList = donors.partners.filter(
      (donor) => !donorsIds.includes(donor.id)
    );
    set({ donors: { ...donors, partners: updatedList } });
  },
}));
