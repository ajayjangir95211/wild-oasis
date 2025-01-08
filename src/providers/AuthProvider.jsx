import { useEffect, useState } from "react";
import { ErrorAlert, Spinner } from "../components/UI";
import { AuthContext } from "../contexts";
import { useSupabase } from "../hooks";

export function AuthProvider({ children }) {
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
