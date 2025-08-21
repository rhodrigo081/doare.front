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
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Donation, DonationHistory } from "@/types/Donation";
import { PaginationController } from "@/components/PaginationController";
import { historyStore } from "@/zustand/historyStore";
import { useState, type FormEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { AppError } from "@/utils/AppError";
import { toast } from "react-toastify";

type props<TValue> = {
  columns: ColumnDef<Donation, TValue>[];
};

function HistoryDataTable<TValue>({ columns }: props<TValue>) {
  const [donationHistory, setDonationHistory] = historyStore(
    useShallow((state) => [state.donationHistory, state.setDonationHistory])
  );

  const table = useReactTable({
    data: donationHistory.donations,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

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

      const newPage = (await res.json()) as DonationHistory;

      setCurrentPage(newPage.currentPage);
      setDonationHistory(newPage);
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

      const newSearch = (await res.json()) as DonationHistory;

      setCurrentPage(newSearch.currentPage);
      setDonationHistory(newSearch);
    } catch {
      toast.error("Ocorreu um erro ao buscar os dados!");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap w-full justify-between gap-4 mb-4 transition-all">
        <div className="flex items-center gap-4">
          <div className="relative">
            <form onSubmit={(e) => handleSearchSubmit(e)}>
              <Input
                placeholder="Pesquisar"
                className="pl-8"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </form>
            <Search className="text-foreground/30 absolute left-2 top-1/2 -translate-y-1/2 w-5" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Colunas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
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
          <PaginationController
            currentPage={currentePage}
            totalPages={
              donationHistory.totalPages > 0 ? donationHistory.totalPages : 1
            }
            onPageChange={(page: number) => handleChangePage(page)}
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
        <TableCaption>Histórico de doações</TableCaption>
      </Table>
    </div>
  );
}

export default HistoryDataTable;
