import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewBooking,
  deleteBooking,
  getBooking,
  getBookings,
  updateBooking,
} from "./services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSupabase } from "../../hooks";

export function useGetBookings() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ["getBookings"],
    queryFn: () => getBookings(supabase),
  });
}

export function useGetBooking({ id }) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ["getBooking", id],
    queryFn: () => getBooking(supabase, id),
  });
}

export function useAddNewBooking() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newBooking }) => addNewBooking(supabase, newBooking),
    onSuccess: () => {
      toast.success("Operation successful!");
      queryClient.invalidateQueries(["getBookings"]);
    },
  });
}

export function useUpdateBooking() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ updatedBooking, id }) =>
      updateBooking(supabase, updatedBooking, id),
    onSuccess: (_, { id }) => {
      toast.success("Operation successful!");
      queryClient.invalidateQueries(["getBooking", id]);
      queryClient.invalidateQueries(["getBookings"]);
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const supabase = useSupabase();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id }) => deleteBooking(supabase, id),
    onSuccess: (_, { id }) => {
      toast.success("Operation successful!");
      queryClient.removeQueries(["getBooking", id]);
      queryClient.invalidateQueries(["getBookings"]);
      navigate("/bookings");
    },
  });
}
