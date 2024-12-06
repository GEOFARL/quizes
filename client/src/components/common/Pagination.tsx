import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dictionary } from "@/types/dictionary";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  translation: Dictionary;
};

const PaginationComponent: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = 3,
  translation,
}) => {
  const handlePageClick = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (currentPage > halfVisible + 1) {
      pages.push(1);
      if (currentPage > halfVisible + 2) pages.push("ellipsis-start");
    }

    for (
      let i = Math.max(1, currentPage - halfVisible);
      i <= Math.min(totalPages, currentPage + halfVisible);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - halfVisible) {
      if (currentPage < totalPages - halfVisible - 1)
        pages.push("ellipsis-end");
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "ellipsis-start" || page === "ellipsis-end") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={page === currentPage}
            onClick={handlePageClick(Number(page))}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            translation={translation}
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            translation={translation}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
