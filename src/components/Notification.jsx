import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { useThemeContext } from "../hooks";

export function Notification() {
  const { theme } = useThemeContext();
  return (
    <>
      <Outlet />
      <ToastContainer autoClose={1000} theme={theme} />
    </>
  );
}
