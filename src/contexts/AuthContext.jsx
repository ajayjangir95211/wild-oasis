import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "./SupabaseContext";
import { ErrorAlert, Spinner } from "../components/UI";

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
});

export function AuthContextProvider({ children }) {
  const supabase = useSupabase();
  const [session, setSession] = useState(null);

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    supabase.auth
      .refreshSession()
      .catch((error) => setError(error))
      .finally(() => setIsPending(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session),
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (isPending) return <Spinner />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: Boolean(session), user: session?.user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
