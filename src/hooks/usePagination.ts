import { useMemo, useState } from "react";

export function usePagination<T>(data: T[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  return {
    currentPage,
    totalPages,
    setCurrentPage,
    paginatedData,
  };
}
