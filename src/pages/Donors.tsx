import AddDonorDialog from "@/components/System/Donors/AddDonorDialog";
import DownloadDonorsReport from "@/components/System/Donors/DownloadDonorsReport";
import { donorsColumns } from "@/components/System/Donors/table/DonorsColumns";
import DonorsDataTable from "@/components/System/Donors/table/DonorsDataTable";

const Donors = () => {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-4xl font-semibold mb-2">Doadores</h1>
        <p className="text-gray-700 mb-4">
          Cadastre e acompanhe os dados dos doadores com facilidade e
          organização.
        </p>
        <div className="flex gap-2">
          <AddDonorDialog />

          <DownloadDonorsReport />
        </div>
      </div>
      <section className="">
        <DonorsDataTable columns={donorsColumns} />
      </section>
    </>
  );
};

export default Donors;
