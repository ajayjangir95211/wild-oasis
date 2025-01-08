import { useNavigate } from "react-router-dom";
import {
  useAuthContext,
  useDeleteFile,
  useSupabase,
  useUploadFile,
} from "../../../hooks";
import { FormProvider, useForm } from "react-hook-form";
import { useUpdateUser } from "../hooks";
import { Form } from "../../../components/form-elements/Form";
import { Input } from "../../../components/form-elements/Input";
import { SecondaryBtn, PrimaryBtn, Spinner } from "../../../components/UI";
import { getFileURL } from "../../../services";

export function UserForm() {
  const supabase = useSupabase();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const methods = useForm({
    mode: "all",
    defaultValues: {
      email: user?.email,
      name: user?.user_metadata.name,
    },
  });
  const { handleSubmit } = methods;

  const { isPending: isUploading, mutateAsync: uploadFile } = useUploadFile();
  const { mutate: deleteFile } = useDeleteFile();

  const { isPending: isUpdating, mutate: updateUser } = useUpdateUser();

  async function submitForm(data) {
    try {
      const { image } = data;

      const updatedUser = {
        name: data.name,
      };

      if (image && image[0]) {
        const name = `avatar-${Date.now()}.${image[0].name.split(".").pop()}`;

        const uploadRes = await uploadFile({
          bucket: "avatars",
          name,
          file: image[0],
        });

        updatedUser.avatar_url = getFileURL(
          supabase,
          "avatars",
          uploadRes.path,
        ).data.publicUrl;

        if (user?.user_metadata?.avatar_url) {
          deleteFile({
            bucket: "avatars",
            name: user.user_metadata.avatar_url.split("/").at(-1),
          });
        }
      }

      updateUser({ data: updatedUser });
    } catch (error) {
      console.error(error.message);
    }
  }

  if (isUpdating || isUploading) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit((data) => submitForm(data))}>
      <FormProvider {...methods}>
        <Input
          name="email"
          type="email"
          validation={{ required: "This field is required" }}
          disabled={true}
        />
        <Input
          name="name"
          type="text"
          validation={{ required: "This field is required" }}
        />
        <Input name="image" type="file" />
        <div className="flex gap-4 self-center">
          <SecondaryBtn disabled={isUpdating} onClick={() => navigate(`/`)}>
            Cancel
          </SecondaryBtn>

          <PrimaryBtn type="submit" disabled={isUpdating || isUploading}>
            {isUpdating || isUploading ? "Saving..." : "Save"}
          </PrimaryBtn>
        </div>
      </FormProvider>
    </Form>
  );
}
