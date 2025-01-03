import { FormProvider, useForm } from "react-hook-form";
import { Form } from "../../../components/form-elements/Form";
import { useUpdateUser } from "../hooks";
import { useEffect } from "react";
import { Input } from "../../../components/form-elements/Input";
import { PrimaryBtn, Spinner } from "../../../components/UI";

export function PasswordForm() {
  const methods = useForm({
    mode: "all",
  });
  const { handleSubmit, watch, trigger } = methods;
  const { isPending: isUpdatingPassword, mutate: updatePassword } =
    useUpdateUser();

  useEffect(() => {
    if (watch("password") && watch("confirm_password")) {
      trigger("password");
      trigger("confirm_password");
    }
  }, [watch("password"), watch("confirm_password")]);

  if (isUpdatingPassword) return <Spinner />;

  return (
    <Form
      onSubmit={handleSubmit((data) =>
        updatePassword({ password: data.password }),
      )}
    >
      <FormProvider {...methods}>
        <Input
          name="password"
          type="password"
          validation={{
            required: "This field is required",
            validate: () =>
              !watch("password") ||
              !watch("confirm_password") ||
              watch("password") === watch("confirm_password") ||
              "Passwords do not match",
          }}
        />
        <Input
          name="confirm_password"
          type="password"
          validation={{
            required: "This field is required",
            validate: () =>
              !watch("password") ||
              !watch("confirm_password") ||
              watch("password") === watch("confirm_password") ||
              "Passwords do not match",
          }}
        />
        <PrimaryBtn
          type="submit"
          disabled={isUpdatingPassword}
          className="self-center"
        >
          {isUpdatingPassword ? "Updating Password..." : "Update Password"}
        </PrimaryBtn>
      </FormProvider>
    </Form>
  );
}
