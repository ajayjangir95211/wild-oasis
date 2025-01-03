import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { priceFormatter } from "../../../utils/priceFormatter";

export function BookingPreview({ booking }) {
  const navigate = useNavigate();
  return (
    <article
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/booking/${booking.id}`)}
      className={`grid grid-cols-5 items-center justify-items-center rounded-md bg-gray-200 p-2 text-sm transition-all hover:scale-105 hover:bg-gray-300 dark:bg-gray-800 hover:dark:bg-gray-700`}
    >
      <span>{booking.name}</span>
      <span className="col-span-2">
        <span className="text-nowrap">
          {format(new Date(booking.start_date), "yyyy MMM dd")}
        </span>
        {" - "}
        <span className="text-nowrap">
          {format(new Date(booking.end_date), "yyyy MMM dd")}
        </span>
      </span>
      <span
        className={`text-nowrap rounded-full px-1 font-semibold ${booking.status === "confirmed" && "bg-blue-300 text-blue-800 dark:bg-blue-700 dark:text-blue-300"} ${booking.status === "checked-in" && "bg-green-300 text-green-700 dark:bg-green-700 dark:text-green-300"} ${booking.status === "checked-out" && "bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300"}`}
      >
        {booking.status}
      </span>
      <span className="tracking-wider">{priceFormatter(booking.price)}</span>
    </article>
  );
}
