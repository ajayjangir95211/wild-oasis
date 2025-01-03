import { PasswordForm } from "../features/auth/components/PasswordForm";
import { UserForm } from "../features/auth/components/UserForm";

export function UserPage() {
  return (
    <div className="flex items-center">
      <div className="m-auto flex flex-col items-end gap-4">
        <UserForm />
        <PasswordForm />
      </div>
    </div>
  );
}
