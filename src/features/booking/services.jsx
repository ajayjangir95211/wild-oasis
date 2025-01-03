import { handleSupabaseResponse } from "../../utils/handleSupabaseResponse";

export const getBookings = (supabase) =>
  handleSupabaseResponse(() => supabase.from("bookings").select().order("id"));

export const getBooking = (supabase, id) =>
  handleSupabaseResponse(() =>
    supabase.from("bookings").select().eq("id", id).single(),
  );

export const addNewBooking = (supabase, newBooking) =>
  handleSupabaseResponse(() => supabase.from("bookings").insert(newBooking));

export const updateBooking = (supabase, updatedBooking, id) =>
  handleSupabaseResponse(() =>
    supabase.from("bookings").update(updatedBooking).eq("id", id),
  );

export const deleteBooking = (supabase, id) =>
  handleSupabaseResponse(() => supabase.from("bookings").delete().eq("id", id));
