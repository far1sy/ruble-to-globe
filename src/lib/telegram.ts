import { useEffect, useState } from "react";

type ThemeParams = Record<string, string | undefined>;

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  colorScheme?: "light" | "dark";
  themeParams?: ThemeParams;
  onEvent?: (event: string, cb: () => void) => void;
  offEvent?: (event: string, cb: () => void) => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function haptic(style: "light" | "medium" | "heavy" = "light") {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  } catch {
    /* not in Telegram */
  }
}

export function hapticSuccess() {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
  } catch {
    /* noop */
  }
}

const VAR_MAP: Record<string, string> = {
  bg_color: "--tg-bg",
  secondary_bg_color: "--tg-surface",
  text_color: "--tg-text",
  hint_color: "--tg-hint",
  link_color: "--tg-accent",
  button_color: "--tg-accent",
  button_text_color: "--tg-accent-foreground",
};

function applyTheme(app: TelegramWebApp) {
  const root = document.documentElement;
  const params = app.themeParams ?? {};
  Object.entries(VAR_MAP).forEach(([key, cssVar]) => {
    const value = params[key];
    if (value) root.style.setProperty(cssVar, value);
  });
  root.classList.toggle("dark", app.colorScheme === "dark");
}

/** Initialises the Telegram WebApp: expand + live theme sync. */
export function useTelegram() {
  const [scheme, setScheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (!app) {
      document.documentElement.classList.add("dark");
      return;
    }
    app.ready();
    app.expand();
    applyTheme(app);
    setScheme(app.colorScheme ?? "dark");

    const onThemeChanged = () => {
      applyTheme(app);
      setScheme(app.colorScheme ?? "dark");
    };
    app.onEvent?.("themeChanged", onThemeChanged);
    return () => app.offEvent?.("themeChanged", onThemeChanged);
  }, []);

  return { scheme };
}
