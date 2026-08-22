// Small reusable "< Back" control for inline forms (edit service, book
// appointment) that don't have their own route - so there's nothing for
// the browser's back button to do, and a plain "Cancel" at the bottom of
// a long form is easy to miss.
export default function BackButton({ onClick, label = 'Back' }) {
  return (
    <button type="button" className="back-button" onClick={onClick}>
      <span aria-hidden="true">&larr;</span> {label}
    </button>
  );
}
