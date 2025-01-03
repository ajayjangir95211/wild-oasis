import { useSearchParams } from "react-router-dom";
import { ErrorAlert, PrimaryBtn, Select, Spinner } from "../components/UI";
import { useState } from "react";
import { CabinForm } from "../features/cabin/components/CabinForm";
import { useGetCabins } from "../features/cabin/hooks";
import { CabinPreview } from "../features/cabin/components/CabinPreview";

const SORT_OPTIONS = [
  { value: "name-asc", name: "Name(A-Z)" },
  { value: "name-desc", name: "Name(Z-A)" },
  { value: "price-asc", name: "Price(Low-High)" },
  { value: "price-desc", name: "Price(High-Low)" },
  { value: "max_capacity-asc", name: "Max Capacity(Low-High)" },
  { value: "max_capacity-desc", name: "Max Capacity(High-Low)" },
  { value: "discount-asc", name: "Discount(Low-High)" },
  { value: "discount-desc", name: "Discount(High-Low)" },
];

export function CabinsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "name";
  const order = searchParams.get("order") || "asc";

  const [isFormOpen, setIsFormOpen] = useState(false);

  const { isPending, data: cabins, error, refetch } = useGetCabins();

  const sortedCabins = cabins?.slice(0).sort((a, b) => {
    if (sort === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }

    if (["price", "max_capacity", "discount"].includes(sort)) {
      return order === "asc" ? a[sort] - b[sort] : b[sort] - a[sort];
    }

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
          Add New Cabin
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
        <li className="grid grid-cols-6 justify-items-center">
          <p>Image</p>
          <p className="col-span-2">Name</p>
          <p>Capacity</p>
          <p>Price</p>
          <p>Discount</p>
        </li>
        {sortedCabins.map((cabin) => (
          <li key={cabin.id}>
            <CabinPreview cabin={cabin} />
          </li>
        ))}
      </ul>
      {isFormOpen && (
        <div className="fixed left-0 top-0 z-10 grid h-dvh w-dvw items-center justify-center overflow-auto bg-opacity-75 backdrop-blur-md dark:bg-opacity-75">
          <div className="rounded-2xl border-[1px] border-dark bg-light p-4 shadow-md shadow-dark dark:border-light dark:bg-dark dark:shadow-light">
            <CabinForm closeForm={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
