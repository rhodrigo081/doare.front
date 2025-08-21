import { Checkbox } from "@/components/ui/checkbox";
import type { Donor } from "@/types/Donor";
import type { ColumnDef } from "@tanstack/react-table";
import { cpf } from "cpf-cnpj-validator";

export const donorsColumns: ColumnDef<Donor>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => cpf.format(row.getValue("cpf")),
  },
  {
    accessorKey: "cim",
    header: "CIM",
    cell: ({ row }) => row.getValue("cim"),
  },
  {
    accessorKey: "degree",
    header: "Grau",
    cell: ({ row }) => row.getValue("degree"),
  },
  {
    accessorKey: "profession",
    header: "Profissão",
    cell: ({ row }) => row.getValue("profession") || "",
  },
  {
    accessorKey: "birthdayDate",
    header: "Data de Nascimento",
    cell: ({ row }) => {
      const date = row.getValue<Date | undefined>("birthdayDate");

      return date ? date.toLocaleDateString("pt-br") : "";
    },
  },
  {
    accessorKey: "lastUpdate",
    header: "Última Atualização",
    cell: ({ row }) => {
      const lastUpdate = row.getValue<Date | undefined>("lastUpdate");
      return lastUpdate ? lastUpdate.toLocaleDateString("pt-br") : "Nunca";
    },
  },
];
