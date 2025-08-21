import type { Pix } from "@/types/Pix";
import { create } from "zustand";

type PixStore = {
  pix: Pix | undefined;
  pixStatus: "Pago" | "Pendente" | "Cancelado";
  setPixStatus: (pixStatus: "Pago" | "Pendente" | "Cancelado") => void;
  getPix: () => void;
  setPix: (pix: Pix) => void;
  clearPix: () => void;
};

export const pixStore = create<PixStore>((set) => ({
  pix: undefined,
  getPix: () => {
    const pixData = sessionStorage.getItem("pixData");
    if (pixData) {
      const pix = JSON.parse(pixData);
      set({ pix });
    }
  },
  pixStatus: "Pendente",
  setPixStatus: (pixStatus: "Pago" | "Pendente" | "Cancelado") =>
    set({ pixStatus }),
  setPix: (pix: Pix) => {
    set({ pix });
    sessionStorage.setItem("pixData", JSON.stringify(pix));
  },
  clearPix: () => set({ pix: undefined }),
}));
