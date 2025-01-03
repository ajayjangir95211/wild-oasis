import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDeleteBooking, useGetBooking, useUpdateBooking } from "../hooks";
import {
  ErrorAlert,
  PrimaryBtn,
  RoundBtn,
  Spinner,
} from "../../../components/UI";
import {
  HiOutlineCalendarDateRange,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import { BookingForm } from "./BookingForm";
import { HiOutlineCurrencyRupee, HiOutlineUser } from "react-icons/hi";
import { priceFormatter } from "../../../utils/priceFormatter";
import { format } from "date-fns";

export function Booking() {
  const { id } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { isPending, data: booking, error } = useGetBooking({ id: Number(id) });

  const { isPending: isDeleting, mutate: deleteBooking } = useDeleteBooking();
  const { isPending: isUpdating, mutate: updateBooking } = useUpdateBooking();

  if (isPending || isDeleting || isUpdating) return <Spinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div>
      <article className="flex flex-col gap-8 p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-nowrap text-2xl font-semibold md:text-4xl">
              Booking #{booking.id}
            </h3>
            <span
              className={`text-nowrap rounded-full px-1 ${booking.status === "confirmed" && "bg-blue-300 text-blue-800 dark:bg-blue-700 dark:text-blue-300"} ${booking.status === "checked-in" && "bg-green-300 text-green-700 dark:bg-green-700 dark:text-green-300"} ${booking.status === "checked-out" && "bg-red-300 text-red-700 dark:bg-red-700 dark:text-red-300"}`}
            >
              {booking.status}
            </span>
          </div>
          <div className="flex gap-2">
            <RoundBtn
              title="Edit"
              disabled={!(booking.status === "confirmed")}
              onClick={() => setIsFormOpen(true)}
              className="text-blue-500"
            >
              <HiOutlinePencilSquare className="size-8" />
            </RoundBtn>
            <RoundBtn
              title="delete"
              disabled={isDeleting}
              onClick={() => {
                const ans = confirm(
                  "Are you sure you want to delete this booking?",
                );
                if (ans) deleteBooking({ id: booking.id });
              }}
              className="text-red-500"
            >
              {<HiOutlineTrash className="size-8" />}
            </RoundBtn>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 rounded-2xl p-2 text-white ${booking.status === "confirmed" && "bg-blue-700"} ${booking.status === "checked-in" && "bg-green-700"} ${booking.status === "checked-out" && "bg-red-700"}`}
        >
          <HiOutlineCalendarDateRange className="size-8" />
          <div className="flex flex-col text-lg sm:flex-row sm:gap-2">
            <span className={`text-nowrap`}>
              {format(new Date(booking.start_date), "yyyy MMM dd")}
              {" - "}
              {format(new Date(booking.end_date), "yyyy MMM dd")}{" "}
            </span>
            <span className="text-nowrap">
              <span className="text-sm">In</span> {booking.cabin_name}
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 ${booking.status === "confirmed" && "text-blue-600"} ${booking.status === "checked-in" && "text-green-600"} ${booking.status === "checked-out" && "text-red-600"}`}
        >
          <HiOutlineUser className="size-8" />
          <div className="flex flex-col">
            <span>{`${booking.name} ${booking.total_guests > 1 ? `and ${booking.total_guests > 2 ? `${booking.total_guests - 1} guests` : "1 guest"}` : ""}`}</span>
            <span>{booking.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 text-lg font-semibold tracking-wide text-yellow-600">
          <HiOutlineCurrencyRupee className="size-8" />
          <span>Total Price : {priceFormatter(booking.price)}</span>
        </div>
        <div className="flex gap-8">
          <PrimaryBtn
            onClick={() =>
              updateBooking({
                updatedBooking: { status: "checked-in" },
                id: booking.id,
              })
            }
            disabled={booking.status !== "confirmed" || isUpdating}
          >
            Check In
          </PrimaryBtn>
          <PrimaryBtn
            onClick={() =>
              updateBooking({
                updatedBooking: { status: "checked-out" },
                id: booking.id,
              })
            }
            disabled={
              booking.status !== "checked-in" ||
              booking.status === "checked-out" ||
              isUpdating
            }
            className={
              booking.status !== "checked-in" ||
              booking.status === "checked-out" ||
              isUpdating ||
              "bg-red-500 hover:bg-red-400 dark:hover:bg-red-600"
            }
          >
            Check Out
          </PrimaryBtn>
        </div>
      </article>

      {isFormOpen && (
        <div className="fixed left-0 top-0 z-10 grid h-dvh w-dvw items-center justify-center overflow-auto bg-opacity-75 backdrop-blur-md dark:bg-opacity-75">
          <div className="rounded-2xl border-[1px] border-dark bg-light p-4 shadow-md shadow-dark dark:border-light dark:bg-dark dark:shadow-light">
            <BookingForm
              edit={true}
              booking={booking}
              closeForm={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
