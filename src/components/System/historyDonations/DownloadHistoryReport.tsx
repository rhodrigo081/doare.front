import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Download } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useState } from "react";
import { Calendar } from "../../ui/calendar";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { today } from "@/utils/today";
import { toast } from "react-toastify";
import { AppError } from "@/utils/AppError";

const donwloadReportSchema = z
  .object({
    "start-date": z
      .date({
        required_error: "Data inicial é obrigatória",
        invalid_type_error: "Data inicial deve ser uma data válida",
      })
      .refine((date) => date <= today, {
        message: "Data inicial não pode ser futura",
        path: ["start-date"],
      }),
    "end-date": z
      .date({
        required_error: "Data final é obrigatória",
        invalid_type_error: "Data final deve ser uma data válida",
      })
      .refine((date) => date <= today, {
        message: "Data final não pode ser futura",
        path: ["end-date"],
      }),
  })
  .refine((data) => data["start-date"] <= data["end-date"], {
    message: "Data inicial não pode ser maior que a data final",
    path: ["start-date"],
  });

type DownloadReportFormData = z.infer<typeof donwloadReportSchema>;

const DownloadHistoryReport = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const { control, handleSubmit, watch, reset } =
    useForm<DownloadReportFormData>({
      resolver: zodResolver(donwloadReportSchema),
    });
  const startDate = watch("start-date");
  const endDate = watch("end-date");

  const handleOnSubmit = async (data: DownloadReportFormData) => {
    // return console.log(data["start-date"]);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/relatorio/doacoes/pdf?startDate=${
          new Date(data["start-date"]).toISOString().split("T")[0]
        }&endDate=${new Date(data["end-date"]).toISOString().split("T")[0]}`,
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
      reset();
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
            Escolha o período desejado para gerar o relatório em PDF.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="w-full">
          <div className="flex flex-wrap w-full gap-x-2 gap-y-4">
            <div className="flex-1">
              <Label htmlFor="initial-date" className="px-1 mb-1">
                Data inicial
              </Label>
              <Controller
                name="start-date"
                control={control}
                render={({ field }) => (
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="initial-date"
                        className=" justify-between font-normal w-full"
                      >
                        {field.value
                          ? field.value.toLocaleDateString("pt-br")
                          : "Selecionar data"}
                        <CalendarIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenStart(false);
                        }}
                        disabled={(date) =>
                          (endDate && date > endDate) || date > today
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="flex-1">
              <Label htmlFor="end-date" className="px-1 mb-1">
                Data final
              </Label>
              <Controller
                name="end-date"
                control={control}
                render={({ field }) => (
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="end-date"
                        className="w-full justify-between font-normal"
                      >
                        {field.value
                          ? field.value.toLocaleDateString("pt-br")
                          : "Selecionar data"}
                        <CalendarIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenEnd(false);
                        }}
                        disabled={(date) =>
                          (startDate && date < startDate) || date > today
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="disabled:cursor-not-allowed mt-4 text-white"
              variant={"secondary"}
              disabled={!startDate || !endDate}
            >
              <Download /> Baixar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadHistoryReport;
