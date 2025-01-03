import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";

export const logIn = (supabase, { email, password }) =>
  handleSupabaseResponse(() =>
    supabase.auth.signInWithPassword({ email, password }),
  );

export const logOut = (supabase) =>
  handleSupabaseResponse(async () => {
    const resSession = await supabase.auth.refreshSession();
    const resAction = await supabase.auth.signOut();
    return { data: resAction.data, error: resSession.error || resAction.error };
  });

export const updateUser = (supabase, data) =>
  handleSupabaseResponse(async () => {
    const resSession = await supabase.auth.refreshSession();
    const resAction = await supabase.auth.updateUser(data);
    return { data: resAction.data, error: resSession.error || resAction.error };
  }); // { name, email, data: [...{ key: value }] } = { data };
