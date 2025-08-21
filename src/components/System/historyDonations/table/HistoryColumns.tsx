import type { Donation } from "@/types/Donation";
import type { ColumnDef } from "@tanstack/react-table";
import { cpf } from "cpf-cnpj-validator";

export const historyColumns: ColumnDef<Donation>[] = [
  {
    accessorKey: "donorName",
    header: "Nome",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("donorName")}</span>
    ),
  },
  {
    accessorKey: "donorCPF",
    header: "CPF",
    cell: ({ row }) => cpf.format(row.getValue("donorCPF")),
  },
  {
    accessorKey: "donorCIM",
    header: "CIM",
    cell: ({ row }) => row.getValue("donorCIM"),
  },
  {
    accessorKey: "createdAt",
    header: "Data de doação",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt"))?.toLocaleDateString("pt-br"),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) =>
      (row.getValue("amount") as number)?.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      }),
  },
];
