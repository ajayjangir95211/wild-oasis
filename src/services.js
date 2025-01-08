import { handleSupabaseResponse } from "./utils/handleSupabaseResponse";

export const uploadFile = (supabase, bucket, name, file) =>
  handleSupabaseResponse(() =>
    supabase.storage.from(bucket).upload(name, file),
  );

export const deleteFile = (supabase, bucket, name) =>
  handleSupabaseResponse(() => supabase.storage.from(bucket).remove(name));

export const getFileURL = (supabase, bucket, name) =>
  supabase.storage.from(bucket).getPublicUrl(name);
