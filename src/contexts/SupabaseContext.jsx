import React, { createContext, useContext } from "react";

import { createClient } from "@supabase/supabase-js";
import { ErrorAlert } from "../components/UI";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // Ensures session persists across page reloads
    autoRefreshToken: true, // Automatically refreshes token when it expires
  },
});

const SupabaseContext = createContext();

export const SupabaseProvider = ({ children }) => {
  if (supabase)
    return (
      <SupabaseContext.Provider value={supabase}>
        {children}
      </SupabaseContext.Provider>
    );
  else return <ErrorAlert error={new Error("Supabase was not initialized.")} />;
};

export const useSupabase = () => useContext(SupabaseContext);
