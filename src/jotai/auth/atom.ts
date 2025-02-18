import { atom } from "jotai";

const initialAuthState = {
  isAuthenticated: false,
  user: { username: "", email: "", image: "" },
  token: null,
};

const loadAuthState = () => {
  if (typeof window === "undefined") return initialAuthState;

  const storedAuth = localStorage.getItem("auth");
  return storedAuth ? JSON.parse(storedAuth) : initialAuthState;
};

export const authState = atom(loadAuthState());
