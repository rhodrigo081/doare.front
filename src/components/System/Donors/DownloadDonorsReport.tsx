import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "../../ui/button";
import { useState } from "react";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";

const DownloadDonorsReport = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOnSubmit = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/relatorio/doadores/pdf`,
        { credentials: "include" }
      );

      if (!res.ok) {
        throw new AppError("Ocorreu um erro ao gerar o relatório!");
      }

      const blobPDF = await res.blob();

      const url = URL.createObjectURL(blobPDF);

      window.open(url);

      toast.success("Relatório gerado com sucesso!");

      setOpenModal(false);
    } catch {
      toast.error("Ocorreu um erro ao gerar o relatório!");
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Download /> Baixar relatório
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Baixar relatório</DialogTitle>
          <DialogDescription className="mb-4">
            Baixe o relatório de todos os doadores em PDF.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <Button
            className="disabled:cursor-not-allowed mt-4 text-white"
            variant={"secondary"}
            onClick={handleOnSubmit}
          >
            <Download /> Baixar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadDonorsReport;
