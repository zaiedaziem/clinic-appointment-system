// Shared Previous/Next pagination bar - used by every paginated list page
// (Services, My Appointments, Manage Services, All Appointments) so the
// behaviour and styling stay consistent instead of copy-pasted per page.
export default function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
      <button
        className="secondary"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
        Page {page + 1} of {totalPages}
      </span>
      <button
        className="secondary"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
