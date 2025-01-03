import { Navigate } from "react-router-dom";
import { LoginForm } from "../features/auth/components/LoginForm";
import { Logo } from "../components/Logo";
import { useAuthContext } from "../contexts/AuthContext";

export function LoginPage() {
  const { isLoggedIn } = useAuthContext();
  return isLoggedIn ? (
    <Navigate to="/" replace />
  ) : (
    <div className="flex size-full overflow-auto">
      <div className="m-auto flex flex-col items-center gap-12">
        <div className="h-48">
          <Logo />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
