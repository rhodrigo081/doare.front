import type { DonationHistory } from "@/types/Donation";
import { create } from "zustand";

type historyStore = {
  donationHistory: DonationHistory;
  setDonationHistory: (donationHistory: DonationHistory) => void;
};

export const historyStore = create<historyStore>((set) => ({
  donationHistory: {
    currentPage: 1,
    donations: [],
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  },
  setDonationHistory: (donationHistory: DonationHistory) =>
    set({ donationHistory }),
}));
