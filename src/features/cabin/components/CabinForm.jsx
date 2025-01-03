import { useEffect } from "react";
import { useUploadFile } from "../../../hooks";
import { useAddNewCabin, useUpdateCabin } from "../hooks";
import { Form } from "../../../components/form-elements/Form";
import { Input } from "../../../components/form-elements/Input";
import { TextArea } from "../../../components/form-elements/TextArea";
import { PrimaryBtn, SecondaryBtn, Spinner } from "../../../components/UI";
import { FormProvider, useForm } from "react-hook-form";
import { getFileURL } from "../../../services";
import { useSupabase } from "../../../contexts/SupabaseContext";

export function CabinForm({ edit = false, cabin = {}, closeForm }) {
  const supabase = useSupabase();

  const { name, max_capacity, price, discount, description } = cabin;
  const methods = useForm({
    mode: "all",
    defaultValues: { name, max_capacity, price, discount, description },
  });

  const { handleSubmit, watch, trigger, setValue } = methods;

  const { isPending: isUploading, mutateAsync: uploadFile } = useUploadFile();

  const { isPending: isAdding, mutate: addNewCabin } = useAddNewCabin();
  const { isPending: isUpdating, mutate: updateCabin } = useUpdateCabin();

  const newPrice = watch("price");

  useEffect(() => {
    trigger("discount");
  }, [newPrice, trigger]);

  async function submitForm(data) {
    const { image } = data;

    data = {
      name: data.name,
      description: data.description,
      max_capacity: Number(data.max_capacity),
      price: Number(data.price),
      discount: Number(data.discount),
    };

    if (image && image[0]) {
      const name = `cabin-${Date.now()}.${image[0].name.split(".").pop()}`;

      try {
        const { path } = await uploadFile({
          bucket: "cabin-images",
          name,
          file: image[0],
        });

        data.image_url = getFileURL(
          supabase,
          "cabin-images",
          path,
        ).data.publicUrl;
      } catch (error) {
        return;
      }
    }

    edit
      ? updateCabin(
          { updatedCabin: data, cabin },
          {
            onSuccess: closeForm,
            onError: () => setValue("image", null),
          },
        )
      : addNewCabin(
          { newCabin: data },
          {
            onSuccess: closeForm,
            onError: () => setValue("image", null),
          },
        );
  }

  if (isUpdating || isUploading || isAdding) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit((data) => submitForm(data))}>
      <FormProvider {...methods}>
        <h3 className="self-center p-2 text-2xl font-semibold">
          {edit ? `Edit ${cabin.name}` : "Add New Cabin"}
        </h3>
        <Input
          name="name"
          type="text"
          validation={{ required: "This field is required" }}
        />
        <Input
          name="max_capacity"
          type="number"
          validation={{
            required: "This field is required",
            min: { value: 1, message: "Invalid" },
          }}
        />
        <Input
          name="price"
          type="number"
          validation={{
            required: "This field is required",
            min: { value: 1, message: "Invalid" },
          }}
        />
        <Input
          name="discount"
          type="number"
          validation={{
            min: { value: 0, message: "Invalid" },
            validate: (value) =>
              Number(value) <= Number(newPrice) ||
              "Discount cannot exceed the price",
          }}
        />
        <TextArea
          name="description"
          validation={{ required: "This field is required" }}
        />
        <Input
          name="image"
          type="file"
          validation={
            edit || {
              required: "This field is required",
            }
          }
        />
        <div className="flex gap-12 self-center">
          <SecondaryBtn
            type="button"
            disabled={isUpdating || isUploading || isAdding}
            onClick={closeForm}
          >
            Cancel
          </SecondaryBtn>
          <PrimaryBtn
            type="submit"
            disabled={isUpdating || isUploading || isAdding}
          >
            {isUpdating || isUploading || isAdding ? "Saving..." : "Save"}
          </PrimaryBtn>
        </div>
      </FormProvider>
    </Form>
  );
}
