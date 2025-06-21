import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6 rounded-b-lg">
      <div className="flex-1 flex justify-start">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronLeft className="mr-2 h-4 w-4" />
          Önceki
        </button>
      </div>

      <div>
        <p className="text-sm text-gray-400">
          Sayfa <span className="font-medium text-white">{currentPage}</span> / <span className="font-medium text-white">{totalPages}</span>
        </p>
      </div>

      <div className="flex-1 flex justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sonraki
          <FaChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;