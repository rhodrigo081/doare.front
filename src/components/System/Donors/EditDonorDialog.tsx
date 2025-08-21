import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import { today } from "@/utils/today";
import { degrees, type Donor } from "@/types/Donor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { donorStore } from "@/zustand/donorsStore";
import { editDonorSchema, type EditDonorFormData } from "@/zod/EditDonorSchema";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";

type props = {
  donor: Donor;
};

const EditDonorDialog = ({ donor }: props) => {
  const { register, control, formState, handleSubmit } =
    useForm<EditDonorFormData>({
      resolver: zodResolver(editDonorSchema),
      mode: "onChange",
      defaultValues: {
        name: donor.name,
        cim: donor.cim,
        degree: donor.degree,
        profession: donor.profession,
        birthdayDate: donor.birthdayDate,
      },
    });

  const [openDate, setOpenDate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const updateDonor = donorStore((state) => state.updateDonor);

  const handleOnFormSubmit = async (data: EditDonorFormData) => {
    try {
      const donorUpdated = {
        ...data,
      };

      await updateDonor(donorUpdated, donor.id);
      setOpenDialog(false);
    } catch (err) {
      if (err instanceof AppError) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="text-foreground">
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar doador</DialogTitle>
          <DialogDescription>
            Atualize as informações de um doador já existente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleOnFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="px-1 mb-1 gap-0">
                Nome<span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                minLength={3}
                maxLength={100}
                placeholder="Digite o nome do doador"
                {...register("name")}
              />
              {formState.errors.name && (
                <small className="text-red-500">
                  {formState.errors.name.message}
                </small>
              )}
            </div>
            <div>
              <Label htmlFor="cim" className="px-1 mb-1 gap-0">
                CIM<span className="text-red-500">*</span>
              </Label>

              <Controller
                control={control}
                name="cim"
                render={({ field }) => (
                  <PatternFormat
                    format="####"
                    customInput={Input}
                    value={field.value}
                    placeholder="Digite o CIM do doador"
                    onChange={(e) =>
                      field.onChange(e.target.value.replace(/\D/g, ""))
                    }
                  />
                )}
              />
              {formState.errors.cim && (
                <small className="text-red-500">
                  {formState.errors.cim.message}
                </small>
              )}
            </div>
            <div>
              <Label htmlFor="degree" className="px-1 mb-1 gap-0">
                Grau<span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="degree"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Grau" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(degrees).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formState.errors.degree && (
                <small className="text-red-500">
                  {formState.errors.degree.message}
                </small>
              )}
            </div>
            <div>
              <Label htmlFor="profession" className="px-1 mb-1 gap-0">
                Profissão
              </Label>
              <Input
                type="text"
                placeholder="Digite a profissão do doador"
                maxLength={50}
                {...register("profession")}
              />
              {formState.errors.profession && (
                <small className="text-red-500">
                  {formState.errors.profession.message}
                </small>
              )}
            </div>
            <div>
              <Label htmlFor="birthdayDate" className="px-1 mb-1 gap-0">
                Data de Nascimento
              </Label>
              <Controller
                name="birthdayDate"
                control={control}
                render={({ field }) => (
                  <Popover open={openDate} onOpenChange={setOpenDate}>
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
                          setOpenDate(false);
                        }}
                        disabled={(date) => date > today}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {formState.errors.birthdayDate && (
                <small className="text-red-500">
                  {formState.errors.birthdayDate.message}
                </small>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="disabled:cursor-not-allowed mt-4 text-white"
              variant={"secondary"}
              disabled={!formState.isValid || formState.isSubmitting}
            >
              <Pencil /> Atualizar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDonorDialog;
