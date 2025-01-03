import { useThemeContext } from "../contexts/ThemeContext";

export function Logo() {
  const { theme } = useThemeContext();
  return (
    <img
      src={theme === "light" ? "/logo-light.png" : "/logo-dark.png"}
      alt="logo"
      className="max-h-full max-w-full object-cover"
    />
  );
}
