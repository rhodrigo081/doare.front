import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type PaginationControllerProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const PaginationController = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationControllerProps) => {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages === 0) {
    totalPages = 1;
  }

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    let start: number, end: number;

    if (currentPage >= 3) {
      pages.push("ellipsis");
    }

    if (currentPage <= 2) {
      start = 1;
      end = 3;
    } else if (currentPage >= totalPages - 1) {
      start = totalPages - 2;
      end = totalPages;
    } else {
      start = currentPage - 1;
      end = currentPage + 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      pages.push("ellipsis");
    }
  }

  return (
    <Pagination className="w-auto mx-0">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={`${currentPage < 2 && "opacity-80 pointer-events-none"}`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {pages.map((p, index) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                className={`${
                  currentPage === p && "opacity-70 pointer-events-none"
                }`}
                href="#"
                isActive={p === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            className={`${
              currentPage === totalPages && "opacity-70 pointer-events-none"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};