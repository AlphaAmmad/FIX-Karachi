import React from 'react';

export const Pagination = ({ page, limit, total, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <span className="text-slate-500">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button className="btn-secondary disabled:opacity-50" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Prev
        </button>
        <button className="btn-secondary disabled:opacity-50" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;