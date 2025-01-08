import { useSearchParams } from "react-router-dom";
import { ErrorAlert, Select, Spinner } from "../components/UI";
import { PrimaryBtn } from "../components/UI";
import { useState } from "react";
import { BookingForm } from "../features/booking/components/BookingForm";
import { useGetBookings } from "../features/booking/hooks";
import { BookingPreview } from "../features/booking/components/BookingPreview";

const SORT_OPTIONS = [
  { value: "name-asc", name: "Name (A-Z)" },
  { value: "name-desc", name: "Name (Z-A)" },
  { value: "price-asc", name: "Price (Low-High)" },
  { value: "price-desc", name: "Price (High-Low)" },
  { value: "status-asc", name: "Status (A-Z)" },
  { value: "status-desc", name: "Status (Z-A)" },
  { value: "created_at-asc", name: "Booked (old First)" },
  { value: "created_at-desc", name: "Booked (New First)" },
];

export function BookingsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "created_at";
  const order = searchParams.get("order") || "desc";

  const { isPending, data: bookings, error, refetch } = useGetBookings();

  const sortedBookings = bookings?.slice(0).sort((a, b) => {
    if (["status", "name"].includes(sort))
      return order === "asc"
        ? a[sort].localeCompare(b[sort])
        : b[sort].localeCompare(a[sort]);

    if (["created_at"].includes(sort))
      return order === "asc"
        ? new Date(a[sort]) - new Date(b[sort])
        : new Date(b[sort]) - new Date(a[sort]);

    if (["price"].includes(sort))
      return order === "asc" ? a[sort] - b[sort] : b[sort] - a[sort];

    return 0;
  });

  if (isPending) return <Spinner />;
  if (error) return <ErrorAlert onClick={refetch} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <PrimaryBtn
          onClick={() => setIsFormOpen(true)}
          className="flex-shrink-0"
        >
          Add New Booking
        </PrimaryBtn>
        <Select
          name="sort"
          options={SORT_OPTIONS}
          value={`${sort}-${order}`}
          onChange={(e) =>
            setSearchParams({
              sort: e.target.value.split("-")[0],
              order: e.target.value.split("-")[1],
            })
          }
        />
      </div>
      <ul className="flex flex-col gap-2">
        <li className="grid grid-cols-5 justify-items-center">
          <p>By</p>
          <p className="col-span-2">Dates</p>
          <p>Status</p>
          <p>Price</p>
        </li>
        {sortedBookings.map((booking) => (
          <li key={booking.id}>
            <BookingPreview booking={booking} />
          </li>
        ))}
      </ul>
      {isFormOpen && (
        <div className="fixed left-0 top-0 z-10 grid h-dvh w-dvw items-center justify-center overflow-auto bg-opacity-75 backdrop-blur-md dark:bg-opacity-75">
          <div className="rounded-2xl border-[1px] border-dark bg-light p-4 shadow-md shadow-dark dark:border-light dark:bg-dark dark:shadow-light">
            <BookingForm closeForm={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
