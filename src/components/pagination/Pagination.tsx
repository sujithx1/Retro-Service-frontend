// Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        className={`px-4 py-2 mx-1 rounded-lg ${
          currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className="px-4 py-2 bg-gray-200 rounded-lg">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`px-4 py-2 mx-1 rounded-lg ${
          currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
