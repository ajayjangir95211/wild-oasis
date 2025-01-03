export const handleSupabaseResponse = (req, timeout = 5000) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Request timed out")), timeout);
  });

  return Promise.race([
    req().then(({ data, error }) => {
      if (error) throw new Error(error.message);
      return data;
    }),
    timeoutPromise,
  ]);
};
