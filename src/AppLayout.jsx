import { Link, Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineUser,
} from "react-icons/hi";
import {
  HiBars3,
  HiOutlineBuildingOffice,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { useLogOut } from "./features/auth/hooks";
import { useState } from "react";
import { RoundBtn, Spinner } from "./components/UI";
import { Logo } from "./components/Logo";
import { useThemeContext } from "./contexts/ThemeContext";
import { useAuthContext } from "./contexts/AuthContext";

const DEFAULT_AVATAR = "/default-user.jpg";

export function AppLayout() {
  const navigate = useNavigate();
  const [isSideNavOpen, setSideNavOpen] = useState(false);
  const { isLoggedIn, user } = useAuthContext();

  const { isPending: isLoggingOut, mutate: logOut } = useLogOut();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (isLoggingOut) return <Spinner />;

  return (
    <div className="grid size-full grid-rows-[auto,1fr] gap-2">
      <header className="grid grid-cols-3 items-center border-b-[1px] border-solid border-green-500 p-2 text-green-500 md:flex md:justify-between">
        <div className="flex items-center gap-4 justify-self-start md:hidden">
          <RoundBtn
            title="menu"
            onClick={() => setSideNavOpen((isSideNavOpen) => !isSideNavOpen)}
          >
            <HiBars3 className="size-8" />
          </RoundBtn>
          <ThemeBtn />
        </div>
        <Link
          to="/"
          className="flex h-12 items-center justify-self-center md:h-16"
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-4 justify-self-end">
          <RoundBtn
            title="User Profile"
            onClick={() => navigate("/user")}
            className="size-12"
          >
            <img
              src={user?.user_metadata.avatar_url || DEFAULT_AVATAR}
              alt="Avatar Image"
              className="size-full object-cover"
            />
          </RoundBtn>
          <ThemeBtn className="hidden md:block" />
          <RoundBtn title="Log Out" onClick={() => logOut()}>
            <HiOutlineLogout className="size-8" />
          </RoundBtn>
        </div>
      </header>
      <div className="grid gap-2 overflow-hidden md:grid-cols-4">
        <aside
          className={`fixed left-0 top-0 h-dvh w-dvw bg-gray-200 p-4 transition-all duration-500 ease-in-out dark:bg-gray-800 ${isSideNavOpen ? "z-20 bg-opacity-90 backdrop-blur-sm dark:bg-opacity-90" : "-z-10 bg-opacity-0 opacity-0"} md:static md:z-auto md:size-auto md:rounded-3xl md:bg-opacity-100 md:opacity-100 md:backdrop-blur-none`}
          onClick={() => setSideNavOpen(false)}
        >
          <nav className="flex size-full items-center justify-center">
            <ul className="flex flex-col gap-8">
              <li>
                <NavLinkItem to="/">
                  <HiOutlineHome className="size-8" /> <span>Home</span>
                </NavLinkItem>
              </li>
              <li>
                <NavLinkItem to="/cabins">
                  <HiOutlineBuildingOffice className="size-8" />
                  <span>Cabins</span>
                </NavLinkItem>
              </li>
              <li>
                <NavLinkItem to="/bookings">
                  <HiOutlineCalendarDays className="size-8" />
                  <span>Bookings</span>
                </NavLinkItem>
              </li>
              <li>
                <NavLinkItem to="/user">
                  <HiOutlineUser className="size-8" /> <span>User</span>
                </NavLinkItem>
              </li>
              <li>
                {/* <NavLinkItem to="/about">
                  <HiOutlineInformationCircle className="size-8" />
                  <span>About</span>
                </NavLinkItem> */}
              </li>
            </ul>
          </nav>
        </aside>
        <main className="relative col-span-3 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const NavLinkItem = ({ to, onClick, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `${
        isActive ? "text-green-500" : "hover:text-green-500 hover:underline"
      } flex items-center gap-4 transition-all`
    }
  >
    {children}
  </NavLink>
);

function ThemeBtn({ className = "" }) {
  const { theme, setTheme } = useThemeContext();

  return (
    <RoundBtn
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
      onClick={() => setTheme((theme) => (theme === "dark" ? "light" : "dark"))}
      className={className}
    >
      {theme === "dark" ? (
        <HiOutlineSun className="size-8" />
      ) : (
        <HiOutlineMoon className="size-8" />
      )}
    </RoundBtn>
  );
}
