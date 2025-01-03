import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewCabin,
  deleteCabin,
  getCabin,
  getCabins,
  updateCabin,
} from "./services";
import { useSupabase } from "../../contexts/SupabaseContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteFile } from "../../hooks";

export function useGetCabins() {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ["getCabins"],
    queryFn: () => getCabins(supabase),
  });
}

export function useGetCabin({ id }) {
  const supabase = useSupabase();
  return useQuery({
    queryKey: ["getCabin", id],
    queryFn: () => getCabin(supabase, id),
  });
}

export function useAddNewCabin() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { mutate: deleteFile } = useDeleteFile();

  return useMutation({
    mutationFn: ({ newCabin }) => addNewCabin(supabase, newCabin),
    onSuccess: () => {
      queryClient.invalidateQueries(["getCabins"]);
      toast.success("Operation successful!");
    },
    onError: (error, { newCabin }) => {
      toast.error("Something went wrong!");
      console.error(error);
      if (newCabin.image_url)
        deleteFile({
          bucket: "cabin-images",
          name: newCabin.image_url.split("/").at(-1) || "",
        });
    },
  });
}

export function useUpdateCabin() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { mutate: deleteFile } = useDeleteFile();

  return useMutation({
    mutationFn: ({ updatedCabin, cabin }) =>
      updateCabin(supabase, updatedCabin, cabin.id),
    onSuccess: (_, { updatedCabin, cabin }) => {
      queryClient.invalidateQueries(["getCabin", cabin.id]);
      queryClient.invalidateQueries(["getCabins"]);
      toast.success("Operation successful!");
      if (updatedCabin.image_url)
        deleteFile({
          bucket: "cabin-images",
          name: cabin.image_url.split("/").at(-1) || "",
        });
    },
    onError: (error, { updatedCabin }) => {
      toast.error("Something went wrong!");
      console.error(error);

      if (updatedCabin.image_url)
        deleteFile({
          bucket: "cabin-images",
          name: updatedCabin.image_url.split("/").at(-1) || "",
        });
    },
  });
}

export function useDeleteCabin() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id }) => deleteCabin(supabase, id),
    onSuccess: (_, { id }) => {
      toast.success("Operation successful!");
      queryClient.removeQueries(["getCabin", id]);
      queryClient.invalidateQueries(["getCabins"]);
      navigate("/cabins");
    },
  });
}
