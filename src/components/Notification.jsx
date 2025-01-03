import React from "react";
import { ToastContainer } from "react-toastify";
import { useThemeContext } from "../contexts/ThemeContext";
import { Outlet } from "react-router-dom";

export function Notification() {
  const { theme } = useThemeContext();
  return (
    <>
      <Outlet />
      <ToastContainer autoClose={1000} theme={theme} />
    </>
  );
}
