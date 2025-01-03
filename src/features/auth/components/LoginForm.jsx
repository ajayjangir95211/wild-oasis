import { FormProvider, useForm } from "react-hook-form";
import { useLogIn } from "../hooks";
import { Form } from "../../../components/form-elements/Form";
import { Input } from "../../../components/form-elements/Input";
import { PrimaryBtn, Spinner } from "../../../components/UI";
import { HiOutlineLogin } from "react-icons/hi";

export function LoginForm() {
  const methods = useForm({
    mode: "all",
    defaultValues: { email: "tericar119@pokeline.com", password: "supabase" },
  });

  const { handleSubmit } = methods;
  const { isPending: isLoggingIn, mutate: logIn } = useLogIn();

  if (isLoggingIn) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit((data) => logIn(data))}>
      <FormProvider {...methods}>
        <Input
          name="email"
          type="email"
          validation={{ required: "This field is required" }}
        />
        <Input
          name="password"
          type="password"
          validation={{ required: "This field is required" }}
        />
        <PrimaryBtn
          type="submit"
          disabled={isLoggingIn}
          className="self-center"
        >
          <span>{isLoggingIn ? "Logging In..." : "Log In"}</span>
          <HiOutlineLogin className="size-8" />
        </PrimaryBtn>
      </FormProvider>
    </Form>
  );
}
