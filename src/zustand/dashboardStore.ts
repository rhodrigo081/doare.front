import type { Last6MonthDonations } from "@/types/Last6MonthDonations";
import type { Last6MonthDonors } from "@/types/Last6MonthDonors";
import { create } from "zustand";

type DashboardStore = {
  last6MonthDonations: Last6MonthDonations[];
  setLast6MonthDonations: (donations: Last6MonthDonations[]) => void;
  last6MonthDonors: Last6MonthDonors[];
  setLast6MonthDonors: (donors: Last6MonthDonors[]) => void;
};

export const dashboardStore = create<DashboardStore>((set) => ({
  last6MonthDonations: [],
  setLast6MonthDonations: (last6MonthDonations: Last6MonthDonations[]) =>
    set({ last6MonthDonations }),
  last6MonthDonors: [],
  setLast6MonthDonors: (last6MonthDonors: Last6MonthDonors[]) =>
    set({ last6MonthDonors }),
}));
