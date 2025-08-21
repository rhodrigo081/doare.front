export type Donation = {
  id: string;
  donorName: string;
  donorCPF: string;
  donorCIM: string;
  createdAt: Date;
  amount: number;
};

export type DonationHistory = {
  currentPage: number;
  donations: Donation[];
  limit: number;
  totalPages: number;
  totalResults: number;
};
