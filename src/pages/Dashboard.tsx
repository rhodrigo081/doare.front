import { DonationsChart } from "@/components/System/Dashboard/DonationsChart";
import { DonorsChart } from "@/components/System/Dashboard/DonorsChart";
import TotalDonationQuantityCard from "@/components/System/Dashboard/TotalDonationQuantityCard";
import TotalDonationValueCard from "@/components/System/Dashboard/TotalDonationValueCard";
import TotalDonorsQuantityCard from "@/components/System/Dashboard/TotalDonorsQuantityCard";

const Dashboard = () => {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
        <p className="text-gray-700">
          Acompanhe todas as informações e gerencie suas operações.
        </p>
      </div>
      <div>
        <section className="grid grid-auto-fit-300 gap-5 mb-5">
          <TotalDonationValueCard />
          <TotalDonationQuantityCard />
          <TotalDonorsQuantityCard />
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DonationsChart />
          <DonorsChart />
        </section>
      </div>
    </>
  );
};

export default Dashboard;
