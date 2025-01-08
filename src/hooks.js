import { useMutation } from "@tanstack/react-query";
import { deleteFile, uploadFile } from "./services";
import { useContext } from "react";
import { AuthContext, SupabaseContext, ThemeContext } from "./contexts";

export const useUploadFile = () => {
  const supabase = useSupabase();
  return useMutation({
    mutationFn: ({ bucket, name, file }) =>
      uploadFile(supabase, bucket, name, file),
    onSuccess: (_, { name }) => console.log(`Uploaded file ${name} `),
    onError: (_, { name }) => console.error(`Failed to upload file ${name}`),
  });
};

export const useDeleteFile = () => {
  const supabase = useSupabase();
  return useMutation({
    mutationFn: ({ bucket, name }) => deleteFile(supabase, bucket, name),
    onSuccess: (_, { name }) => console.log(`Deleted file ${name}`),
    onError: (_, { name }) => console.error(`Failed to delete file ${name}`),
  });
};

export const useThemeContext = () => useContext(ThemeContext);
export const useAuthContext = () => useContext(AuthContext);
export const useSupabase = () => useContext(SupabaseContext);
