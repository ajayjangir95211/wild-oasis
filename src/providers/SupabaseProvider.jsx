import { ErrorAlert } from "../components/UI";
import { SupabaseContext } from "../contexts";
import { supabase } from "../supabase";

export const SupabaseProvider = ({ children }) => {
  if (supabase)
    return (
      <SupabaseContext.Provider value={supabase}>
        {children}
      </SupabaseContext.Provider>
    );
  else return <ErrorAlert error={new Error("Supabase was not initialized.")} />;
};
