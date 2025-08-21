import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  ChevronDown,
  Ellipsis,
  Search,
} from "lucide-react";
import EditDonorDialog from "../EditDonorDialog";
import ExcludeDonorDialog from "../ExcludeDonorDialog";
import type { Donor, DonorRes } from "@/types/Donor";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, type FormEvent } from "react";
import MassExclusionDonorDialog from "../MassExclusionDonorDialog";
import { PaginationController } from "@/components/PaginationController";
import { donorStore } from "@/zustand/donorsStore";
import { AppError } from "@/utils/AppError";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";

type props<TValue> = {
  columns: ColumnDef<Donor, TValue>[];
};

function DonorsDataTable<TValue>({ columns }: props<TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [donors, setDonors] = donorStore(
    useShallow((state) => [state.donors, state.setDonors])
  );
  const [currentePage, setCurrentPage] = useState(1);

  const handleChangePage = async (page: number) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/doacoes?page=${page}&search=${search}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.log(res.statusText);
        throw new AppError("Ocorreu um erro ao buscar os dados!");
      }

      const newPage = (await res.json()) as DonorRes;

      setCurrentPage(newPage.currentPage);
      setDonors(newPage);
    } catch {
      toast.error("Ocorreu um erro ao buscar os dados!");
    }
  };

  const [search, setSearch] = useState("");

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/doacoes?search=${search}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new AppError("Ocorreu um erro ao buscar os dados!");
      }

      const newSearch = (await res.json()) as DonorRes;

      setCurrentPage(newSearch.currentPage);
      setDonors(newSearch);
    } catch {
      toast.error("Ocorreu um erro ao buscar os dados!");
    }
  };

  const table = useReactTable({
    data: donors.partners,
    columns,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  const selectedRowsIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap w-full justify-between gap-4 mb-4 transition-all">
        <div className="flex items-center gap-4">
          <form onSubmit={(e) => handleSearchSubmit(e)} className="relative">
            <Input
              placeholder="Pesquisar"
              className="pl-8"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="text-foreground/30 absolute left-2 top-1/2 -translate-y-1/2 w-5" />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Colunas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.header as string}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-4 justify-center w-full sm:w-fit">
          {(table.getIsSomePageRowsSelected() ||
            table.getIsAllPageRowsSelected()) && (
            <div>
              <MassExclusionDonorDialog
                selectedRowsIds={selectedRowsIds}
                table={table}
              />
            </div>
          )}
          <PaginationController
            currentPage={currentePage}
            totalPages={donors.totalPages > 0 ? donors.totalPages : 1}
            onPageChange={(page) => {
              handleChangePage(page);
            }}
          />
        </div>
      </div>
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className="text-left"
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "desc" ? (
                              <ArrowDown />
                            ) : (
                              <ArrowUp />
                            )
                          ) : (
                            <ArrowDownUp />
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="hover:bg-foreground/5"
                      >
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="min-w-fit overflow-hidden flex flex-col gap-1 p-2"
                      align="end"
                    >
                      <EditDonorDialog donor={row.original as Donor} />
                      <ExcludeDonorDialog donorId={row.original.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhum dado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>Lista dos doadores</TableCaption>
      </Table>
    </div>
  );
}

export default DonorsDataTable;
