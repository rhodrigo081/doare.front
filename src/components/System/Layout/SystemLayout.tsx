import { useCallback, useEffect, useState } from "react";
import SideBar from "./SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";
import { donorStore } from "@/zustand/donorsStore";
import { historyStore } from "@/zustand/historyStore";
import { dashboardStore } from "@/zustand/dashboardStore";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";
import { loginVerify } from "@/assets/helpers/loginVerify";
import { AppError } from "@/utils/AppError";
import { UserStore } from "@/zustand/user";
import { pixStore } from "@/zustand/pixStore";
import LoadingPage from "@/components/LoadingPage";

const SystemLayout = () => {
  const [openAside, setOpenAside] = useState<boolean>(true);
  const setDonors = donorStore((state) => state.setDonors);
  const setHistory = historyStore((state) => state.setDonationHistory);
  const [setLast6MonthDonations, setLast6MonthDonors] = dashboardStore(
    useShallow((state) => [
      state.setLast6MonthDonations,
      state.setLast6MonthDonors,
    ])
  );
  const user = UserStore((state) => state.user);
  const [loading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const getPixData = pixStore((state) => state.getPix);

  const getDashboardData = useCallback(async () => {
    const donationRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/doacoes/evolucao`,
      {
        credentials: "include",
      }
    );

    loginVerify(donationRes, navigate);

    if (!donationRes.ok) {
      throw new AppError("Ocorreu um erro ao buscar os dados do dashboard!");
    }

    const last6MonthDonations = await donationRes.json();

    setLast6MonthDonations(last6MonthDonations);

    const donorsRes = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/parceiros/evolucao`,
      {
        credentials: "include",
      }
    );

    loginVerify(donorsRes, navigate);

    if (!donorsRes.ok) {
      throw new AppError("Ocorreu um erro ao buscar os dados do dashboard!");
    }

    const last6MonthDonors = await donorsRes.json();

    setLast6MonthDonors(last6MonthDonors);
  }, [setLast6MonthDonations, navigate, setLast6MonthDonors]);

  const getDonors = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/parceiros`, {
      credentials: "include",
    });
    loginVerify(res, navigate);
    if (!res.ok) {
      throw new AppError("Ocorreu um erro ao buscar o histórico de doações!");
    }
    const donors = await res.json();
    setDonors(donors);
  }, [setDonors, navigate]);

  const getHistory = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/doacoes`, {
      credentials: "include",
    });
    loginVerify(res, navigate);
    if (!res.ok) {
      throw new AppError("Ocorreu um erro ao buscar o histórico de doações!");
    }
    const history = await res.json();
    setHistory(history);
  }, [setHistory, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        await getDashboardData();
        await getHistory();
        await getDonors();
        getPixData();
        setIsLoading(false);
      } catch (err) {
        if (err instanceof AppError) {
          return toast.error(err.message);
        }
        return toast.error("Ocorreu um erro ao buscar os dados!");
      }
    };

    fetchData();
  }, [
    user,
    setLast6MonthDonations,
    setDonors,
    setHistory,
    getDashboardData,
    getDonors,
    getHistory,
    getPixData,
  ]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full ">
      <MobileNav />
      <SideBar openAside={openAside} setOpenAside={setOpenAside} />
      <main
        className={`${
          openAside ? "lg:ml-[309px]" : "lg:ml-[88px]"
        } px-5 py-8 flex-1 transition-all`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default SystemLayout;
