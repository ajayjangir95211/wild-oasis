export function Form({ onSubmit, children }) {
  return (
    <form className={`flex flex-col gap-2`} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
