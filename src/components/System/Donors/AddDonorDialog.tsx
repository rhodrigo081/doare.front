import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CirclePlus } from "lucide-react";
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
import { addDonorSchema, type AddDonorFormData } from "@/zod/AddDonorSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { degrees } from "@/types/Donor";
import { donorStore } from "@/zustand/donorsStore";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";

const AddDonorDialog = () => {
  const { register, control, formState, handleSubmit, reset } =
    useForm<AddDonorFormData>({
      resolver: zodResolver(addDonorSchema),
      mode: "onChange",
    });

  const [openDate, setOpenDate] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const addDonor = donorStore((state) => state.addDonor);

  const handleOnFormSubmit = async (data: AddDonorFormData) => {
    try {
      await addDonor(data);

      reset();
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
        <Button variant={"default"}>
          <CirclePlus /> Adicionar doador
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar doador</DialogTitle>
          <DialogDescription className="">
            Adicione um novo doador à sua rede de apoio.
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
                placeholder="Digite o nome do doador"
                maxLength={100}
                minLength={3}
                {...register("name")}
              />
              {formState.errors.name && (
                <small className="text-red-500">
                  {formState.errors.name.message}
                </small>
              )}
            </div>
            <div>
              <Label htmlFor="cpf" className="px-1 mb-1 gap-0">
                CPF<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <PatternFormat
                    format="###.###.###-##"
                    customInput={Input}
                    placeholder="Digite o CPF do doador"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                  />
                )}
              />
              {formState.errors.cpf && (
                <small className="text-red-500">
                  {formState.errors.cpf.message}
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
                maxLength={50}
                placeholder="Digite a profissão do doador"
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
              <CirclePlus /> Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDonorDialog;
