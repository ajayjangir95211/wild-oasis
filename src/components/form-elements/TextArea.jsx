import { useFormContext } from "react-hook-form";
import { formatLabel } from "../../utils/formatLabel";

export function TextArea({ name, validation = {}, disabled = false }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-[6rem,12rem] grid-rows-[auto,auto] items-center gap-x-4 gap-y-1">
      <label className="text-right" htmlFor={name}>
        {formatLabel(name)}
      </label>
      <textarea
        className={`rounded-xl bg-gray-300 p-1 dark:bg-gray-700 ${disabled && "bg-gray-500 dark:bg-gray-500"}`}
        id={name}
        disabled={disabled}
        {...register(name, validation)}
      />
      <span
        className={`col-start-2 text-sm text-red-500 ${errors && errors[name]?.message ? "visible" : "invisible"}`}
      >
        {(errors && errors[name]?.message) || "No Error"}
      </span>
    </div>
  );
}
