import DownloadHistoryReport from "@/components/System/historyDonations/DownloadHistoryReport";
import { historyColumns } from "@/components/System/historyDonations/table/HistoryColumns";
import HistoryDataTable from "@/components/System/historyDonations/table/HistoryDataTable";

const DonationHistory = () => {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-4xl font-semibold mb-2">Histórico de doações</h1>
        <p className="text-gray-700 mb-4">
          Visualize e gerencie o histórico de doações com clareza e praticidade.
        </p>
        <div className="flex gap-2">
          <DownloadHistoryReport />
        </div>
      </div>
      <section>
        <HistoryDataTable columns={historyColumns} />
      </section>
    </>
  );
};

export default DonationHistory;
