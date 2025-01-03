import { useGetCabins } from "../../cabin/hooks";
import { useAddNewBooking, useUpdateBooking } from "../hooks";
import { PrimaryBtn, SecondaryBtn, Spinner } from "../../../components/UI";
import { Form } from "../../../components/form-elements/Form";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "../../../components/form-elements/Input";
import { Select } from "../../../components/form-elements/Select";

export function BookingForm({ edit = false, booking = {}, closeForm }) {
  const { data: cabins, isPending, error } = useGetCabins();

  const {
    name,
    email,
    start_date,
    end_date,
    total_guests,
    cabin_id: cabin,
  } = booking;

  const methods = useForm({
    mode: "all",
    defaultValues: {
      name,
      email,
      start_date,
      end_date,
      total_guests,
      cabin,
    },
  });

  const { handleSubmit, watch, trigger } = methods;

  const { isPending: isAdding, mutate: addNewBooking } = useAddNewBooking();

  const { isPending: isUpdating, mutate: updateBooking } = useUpdateBooking({});

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  useEffect(() => {
    if (startDate && endDate) {
      trigger("end_date");
      trigger("start_date");
    }
  }, [startDate, endDate, trigger]);

  const cabin_id = watch("cabin");
  useEffect(() => {
    if (watch("total_guests")) trigger("total_guests");
  }, [cabin_id]);

  async function submitForm(data) {
    const cabin = cabins.find((cabin) => cabin.id === Number(data.cabin));

    delete data.cabin;

    data = {
      ...data,
      cabin_id: cabin.id,
      cabin_name: cabin.name,
      price: cabin.price - cabin.discount,
      status: "confirmed",
    };

    edit
      ? updateBooking(
          { updatedBooking: data, id: booking.id },
          { onSuccess: closeForm },
        )
      : addNewBooking({ newBooking: data }, { onSuccess: closeForm });
  }

  if (isPending || isUpdating || isAdding) return <Spinner />;
  if (error) return <Error error={error} />;

  return (
    <Form onSubmit={handleSubmit((data) => submitForm(data))}>
      <FormProvider {...methods}>
        <h3 className="self-center p-2 text-2xl font-semibold">
          {edit ? `Edit Booking #${booking.id}` : "Add New Booking"}
        </h3>
        <Input
          name="name"
          type="text"
          validation={{ required: "This field is required" }}
        />
        <Input
          name="email"
          type="email"
          validation={{
            required: "This field is required",
          }}
        />
        <Input
          name="start_date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          validation={{
            required: "This field is required",
            validate: () =>
              startDate && endDate && startDate > endDate
                ? "Start date cannot be after end date"
                : true,
          }}
        />
        <Input
          name="end_date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          validation={{
            required: "This field is required",
            validate: () =>
              startDate && endDate && startDate > endDate
                ? "End date cannot be before start date"
                : true,
          }}
        />
        <Input
          name="total_guests"
          type="number"
          min="1"
          validation={{
            required: "This field is required",
            validate: (value) =>
              !cabin_id ||
              value <=
                cabins.find((cabin) => cabin.id === Number(cabin_id))
                  .max_capacity ||
              "Guests exceeded max capacity",
          }}
        />
        <Select
          name="cabin"
          validation={{ required: "This field is required" }}
          options={[
            { value: "", name: "Select a Cabin" },
            ...cabins.map((cabin) => ({
              value: cabin.id,
              name: `${cabin.name} (${cabin.max_capacity})`,
            })),
          ]}
        />
        <div className="flex gap-12 self-center">
          <SecondaryBtn
            type="button"
            disabled={isAdding || isUpdating}
            onClick={closeForm}
          >
            Cancel
          </SecondaryBtn>
          <PrimaryBtn type="submit" disabled={isAdding || isUpdating}>
            {isAdding || isUpdating ? "Saving..." : "Save"}
          </PrimaryBtn>
        </div>
      </FormProvider>
    </Form>
  );
}
