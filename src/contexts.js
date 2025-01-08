import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
});

export const SupabaseContext = createContext();

export const ThemeContext = createContext();
