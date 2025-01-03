import { useMutation } from "@tanstack/react-query";
import { logIn, logOut, updateUser } from "./services";
import { useSupabase } from "../../contexts/SupabaseContext";

export function useLogIn() {
  const supabase = useSupabase();
  return useMutation({
    mutationFn: ({ email, password }) => logIn(supabase, { email, password }),
  });
}

export function useLogOut() {
  const supabase = useSupabase();
  return useMutation({
    mutationFn: () => logOut(supabase),
  });
}

export function useUpdateUser() {
  const supabase = useSupabase();
  return useMutation({
    mutationFn: (data) => updateUser(supabase, data),
  });
}
