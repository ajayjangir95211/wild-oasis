import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { LoginPage } from "./Pages/LoginPage";
import { ErrorPage } from "./Pages/ErrorPage";
import { AppLayout } from "./AppLayout";
import { UserPage } from "./Pages/UserPage";
import { CabinsPage } from "./Pages/CabinsPage";
import { Cabin } from "./features/cabin/components/Cabin";
import { BookingsPage } from "./Pages/BookingsPage";
import { Booking } from "./features/booking/components/Booking";
import { ErrorBoundary } from "react-error-boundary";
import { FallbackUI } from "./components/UI";
import { toast } from "react-toastify";
import { Notification } from "./components/Notification";
import { ThemeProvider } from "./providers/ThemeProvider";
import { SupabaseProvider } from "./providers/SupabaseProvider";
import { AuthProvider } from "./providers/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        toast.error("Something went wrong!");
        console.error(error);
      },
      onSuccess: () => toast.success("Operation successful!"),
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={FallbackUI}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SupabaseProvider>
            <AuthProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<Notification />}>
                    <Route element={<AppLayout />}>
                      <Route index element={<HomePage />} />

                      <Route path="/cabins" element={<CabinsPage />} />
                      <Route path="/cabin/:id" element={<Cabin />} />

                      <Route path="/bookings" element={<BookingsPage />} />
                      <Route path="/booking/:id" element={<Booking />} />

                      <Route path="/user" element={<UserPage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<ErrorPage />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
