import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  startIndex: number;
  endIndex: number;
  getPaginatedData: (data: T[]) => T[];
}

export function usePagination<T>({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationOptions): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pagination = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [currentPage, totalPages, itemsPerPage, totalItems]);

  const nextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
  };

  const getPaginatedData = (data: T[]): T[] => {
    return data.slice(pagination.startIndex, pagination.endIndex);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    startIndex: pagination.startIndex,
    endIndex: pagination.endIndex,
    getPaginatedData,
  };
}
