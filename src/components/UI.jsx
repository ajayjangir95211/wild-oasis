import { formatLabel } from "../utils/formatLabel";
import {
  HiOutlineExclamationCircle,
  HiOutlineHome,
  HiOutlineRefresh,
} from "react-icons/hi";

export const FallbackUI = ({ resetErrorBoundary }) => (
  <div className="flex size-full overflow-auto">
    <div className="m-auto flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-xl text-red-500">
        <HiOutlineExclamationCircle className="size-8 stroke-2" />
        <span>Oops! Something went wrong.</span>
      </div>
      <div className="flex items-center gap-2">
        <PrimaryBtn onClick={resetErrorBoundary}>
          <HiOutlineRefresh className="size-8" />
          <span>Try Again</span>
        </PrimaryBtn>
        <PrimaryBtn onClick={() => location.replace("/")}>
          <HiOutlineHome className="size-8" />
          <span>Home</span>
        </PrimaryBtn>
      </div>
    </div>
  </div>
);

export const ErrorAlert = ({ onClick = null }) => (
  <div className="flex size-full overflow-auto">
    <div className="m-auto flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-xl text-red-500">
        <HiOutlineExclamationCircle className="size-8 stroke-2" />
        <span>Oops! Something went wrong.</span>
      </div>
      <PrimaryBtn onClick={onClick}>
        <HiOutlineRefresh className="size-8" />
        <span>Retry</span>
      </PrimaryBtn>
    </div>
  </div>
);

export const Select = ({
  name,
  value,
  disabled = false,
  options = [],
  onChange = null,
}) => (
  <div className="grid grid-cols-[auto,auto] items-center gap-2">
    <label className="" htmlFor={name}>
      {formatLabel(name)}
    </label>
    <select
      className={`w-24 rounded-full bg-gray-300 p-1 dark:bg-gray-700 ${disabled && "bg-gray-500 dark:bg-gray-500"}`}
      id={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {options.map((o, i) => (
        <option value={o.value} key={i}>
          {o.name}
        </option>
      ))}
    </select>
  </div>
);

export const Spinner = () => (
  <div className="absolute top-0 z-10 flex size-full items-center justify-center bg-light bg-opacity-75 backdrop-blur-sm dark:bg-dark dark:bg-opacity-75">
    <div className="loader bg-green-600 dark:bg-green-400"></div>
  </div>
);

export const Button = ({
  type = "button",
  title = "This is a button",
  disabled = false,
  onClick = null,
  className = "",
  children,
}) => (
  <button
    type={type}
    title={title}
    disabled={disabled}
    onClick={disabled ? null : onClick}
    className={`flex items-center justify-center rounded-full ${disabled && "cursor-not-allowed"} ${className}`}
  >
    {children}
  </button>
);
export const PrimaryBtn = ({
  type = "button",
  title = "",
  disabled = false,
  onClick = null,
  className = "",
  children,
}) => (
  <Button
    type={type}
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={`${disabled ? "bg-gray-500 hover:bg-gray-500 hover:dark:bg-gray-500" : "bg-green-500 hover:bg-green-600 dark:bg-green-700"} flex items-center gap-2 border-[.5px] border-solid border-gray-500 px-2 py-[0.125rem] ${className}`}
  >
    {children}
  </Button>
);

export const RoundBtn = ({
  type = "button",
  title = "This is a button",
  disabled = false,
  onClick = null,
  className = "",
  children,
}) => (
  <Button
    type={type}
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={`flex size-8 items-center justify-center overflow-hidden border-none transition-all ${disabled || "hover:scale-125"} ${className}`}
  >
    {children}
  </Button>
);

export const SecondaryBtn = ({
  type = "button",
  title = "",
  disabled = false,
  onClick,
  className = "",
  children,
}) => (
  <Button
    type={type}
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={`${disabled ? "bg-gray-500 hover:bg-gray-500 hover:dark:bg-gray-500" : "hover:bg-light hover:dark:bg-dark"} border-[.5px] border-solid border-gray-500 px-2 ${className}`}
  >
    {children}
  </Button>
);
