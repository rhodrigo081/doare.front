import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { donorStore } from "@/zustand/donorsStore";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";
import type { Table } from "@tanstack/react-table";
import type { Donor } from "@/types/Donor";

type props = {
  selectedRowsIds: string[];
  table: Table<Donor>;
};

const MassExclusionDonorDialog = ({ selectedRowsIds, table }: props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deleteDonor = donorStore((state) => state.deleteDonor);
  const handleOnExcludeDonor = async () => {
    try {
      setIsLoading(true);
      await deleteDonor(selectedRowsIds);
      setOpenDialog(false);
      table.resetRowSelection();
    } catch (err) {
      if (err instanceof AppError) {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Trash />
          <span className="hidden sm:block">Exclusão em massa</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exclusão em massa</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir estes doadores? Esta ação não pode
            ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="text-right">
          <Button
            onClick={handleOnExcludeDonor}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircle className="animate-spin" /> : <Trash />}
            Excluir{" "}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MassExclusionDonorDialog;
