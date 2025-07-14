type Theme = "dark" | "light";


export default class ThemeControl {
  static getTheme(): Theme {
    if (typeof window === "undefined") return "light"; // SSR fallback

    let theme = getStoredTheme();
    console.log("Current theme:", theme);
    if (!theme) {
      theme = getPreferredTheme();
      setTheme(theme);
    } else {
      setTheme(theme);
    }

    return theme;
  }

  static toggleTheme(): Theme {
    if (typeof window === "undefined") return "light"; // SSR fallback

    let theme = getStoredTheme();
    theme = toggleTheme(theme);
    setTheme(theme);
    return theme;
  }
}
// Helper functions to manage theme
export function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light"; // SSR fallback
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return; // SSR guard
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem("theme", theme);
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light"; // SSR fallback
  const theme = window.localStorage.getItem("theme") as Theme;
  if (theme === "dark" || theme === "light") return theme;

  return getPreferredTheme();
}

function toggleTheme(currentTheme: Theme): Theme {
  return currentTheme === "light" ? "dark" : "light";
}

