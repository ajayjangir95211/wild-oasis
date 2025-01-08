import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";

export const getCabins = (supabase) =>
  handleSupabaseResponse(() => supabase.from("cabins").select().order("name"));

export const getCabin = (supabase, id) =>
  handleSupabaseResponse(() =>
    supabase.from("cabins").select().eq("id", id).single(),
  );

export const addNewCabin = (supabase, newCabin) =>
  handleSupabaseResponse(() => supabase.from("cabins").insert(newCabin));

export const updateCabin = (supabase, updatedCabin, id) =>
  handleSupabaseResponse(() =>
    supabase.from("cabins").update(updatedCabin).eq("id", id),
  );

export const deleteCabin = (supabase, id) =>
  handleSupabaseResponse(() => supabase.from("cabins").delete().eq("id", id));
