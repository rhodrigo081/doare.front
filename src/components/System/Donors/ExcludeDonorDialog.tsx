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

type props = {
  donorId: string;
};

const ExcludeDonorDialog = ({ donorId }: props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deleteDonor = donorStore((state) => state.deleteDonor);
  const handleOnExcludeDonor = async () => {
    try {
      setIsLoading(true);
      await deleteDonor([donorId]);
      setOpenDialog(false);
    } catch (err) {
      if (err instanceof AppError) {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="text-foreground">
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir doador</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este doador? Esta ação não pode ser
            desfeita.
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

export default ExcludeDonorDialog;
