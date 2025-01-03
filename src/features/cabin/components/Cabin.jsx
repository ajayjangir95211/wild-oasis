import { ErrorAlert, RoundBtn, Spinner } from "../../../components/UI";
import { useDeleteCabin, useGetCabin } from "../hooks";
import { useParams } from "react-router-dom";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { CabinForm } from "./CabinForm";
import { useState } from "react";
import { useDeleteFile } from "../../../hooks";
import { HiOutlineCurrencyRupee, HiOutlineUsers } from "react-icons/hi";
import { priceFormatter } from "../../../utils/priceFormatter";

export function Cabin() {
  const { id } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { isPending, data: cabin, error } = useGetCabin({ id: Number(id) });

  const { mutate: deleteFile } = useDeleteFile();
  const { isPending: isDeleting, mutate: deleteCabin } = useDeleteCabin();

  if (isPending || isDeleting) return <Spinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div>
      <article className="flex flex-col gap-4">
        <img
          src={`${cabin.image_url}?v=${new Date().getTime()}`}
          alt={cabin.name}
          className="h-96 rounded-lg object-cover"
        />
        <div className="flex justify-between">
          <h3 className="text-nowrap text-2xl font-semibold md:text-4xl">
            {cabin.name}
          </h3>
          <div className="flex gap-2">
            <RoundBtn
              title="Edit"
              onClick={() => setIsFormOpen(true)}
              className="text-blue-500"
            >
              <HiOutlinePencilSquare className="size-8" />
            </RoundBtn>
            <RoundBtn
              title="Delete"
              disabled={isDeleting}
              onClick={() => {
                const ans = confirm(
                  "Are you sure you want to delete this cabin?",
                );
                if (ans)
                  deleteCabin(
                    { id: cabin.id },
                    {
                      onSuccess: () => {
                        deleteFile({
                          bucket: "cabin-images",
                          name: cabin.image_url.split("/").at(-1) || "",
                        });
                      },
                    },
                  );
              }}
              className="text-red-500"
            >
              <HiOutlineTrash className="size-8" />
            </RoundBtn>
          </div>
        </div>
        <p className="flex items-center gap-2 text-lg font-semibold tracking-wide text-yellow-600">
          <HiOutlineCurrencyRupee className="size-8" />{" "}
          <span>
            Price : {priceFormatter(cabin.price)} <br />
            Discount : {priceFormatter(cabin.discount || 0)}
          </span>
        </p>
        <p className="flex items-center gap-2 text-green-500">
          <HiOutlineUsers className="size-8" /> Max Capacity :{" "}
          {cabin.max_capacity}
        </p>
        <p className="rounded-lg bg-gray-300 p-4 dark:bg-gray-700">
          {cabin.description}
        </p>
      </article>
      {isFormOpen && (
        <div className="fixed left-0 top-0 z-10 grid h-dvh w-dvw items-center justify-center overflow-auto bg-opacity-75 backdrop-blur-md dark:bg-opacity-75">
          <div className="rounded-2xl border-[1px] border-dark bg-light p-4 shadow-md shadow-dark dark:border-light dark:bg-dark dark:shadow-light">
            <CabinForm
              edit={true}
              cabin={cabin}
              closeForm={() => setIsFormOpen(false)}
            />{" "}
          </div>
        </div>
      )}
    </div>
  );
}
