import { create } from "zustand";
import { ITheme } from "../typings/types";
import { platform, Platform } from "@tauri-apps/plugin-os";
import { invoke } from "@tauri-apps/api/core";
import { COMMAND } from "../constants/command";

const themeData = {
  dark: {
    background: "#1e1e1e",
    color: "#f6f6f6",
  },
  light: {
    background: "#ffffff",
    color: "#0f0f0f",
  },
};

type Props = {
  platform: Platform;
  theme: ITheme | undefined;
  setTheme: (theme: ITheme) => void;
  toogleTheme: () => void;
};

const useSysStore = create<Props>((set) => ({
  platform: platform(),
  theme: undefined,
  setTheme: (theme) =>
    set(() => {
      if (theme === "auto") {
        const match = window.matchMedia("(prefers-color-scheme: dark)");
        theme = match.matches ? "dark" : "light";
      }

      if (theme === "dark") {
        document.body.setAttribute("arco-theme", "dark");
      } else {
        document.body.removeAttribute("arco-theme");
      }

      document.body.style.backgroundColor = themeData[theme].background;
      document.body.style.color = themeData[theme].color;

      localStorage.setItem("theme", theme);

      invoke(COMMAND.SET_THEME, { theme });

      return { theme };
    }),
  toogleTheme: () =>
    set((state) => {
      const theme = state.theme === "dark" ? "light" : "dark";

      document.body.style.backgroundColor = themeData[theme].background;
      document.body.style.color = themeData[theme].color;

      localStorage.setItem("theme", theme);
      
      invoke(COMMAND.SET_THEME, { theme });
      return { theme };
    }),
}));

export default useSysStore;
