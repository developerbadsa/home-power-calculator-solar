"use client";

/**
 * Lightweight i18n (§35): a React context holding the active language with a
 * typed `t(key, params?)` function. Labels and copy live in the dictionaries;
 * components never hard-code user-facing strings.
 *
 * The language is read from localStorage through `useSyncExternalStore`, which
 * is hydration-safe: the server snapshot ("en") matches the pre-rendered HTML,
 * and React re-renders with the real stored preference right after hydration —
 * no mismatch, no setState-in-effect.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { en, type MessageKey } from "./en";
import { bn } from "./bn";

export type Lang = "en" | "bn";

const DICTS: Record<Lang, import("./en").Dict> = { en, bn };
const STORAGE_KEY = "hpc-lang";
const LANG_EVENT = "hpc-lang-change";

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a key, interpolating {params}. */
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const isLang = (v: unknown): v is Lang => v === "en" || v === "bn";

function readStoredLang(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return isLang(v) ? v : "en";
  } catch {
    return "en";
  }
}

/** React asks us to re-read the language when this fires. */
function subscribeToLang(callback: () => void) {
  window.addEventListener("storage", callback); // another tab changed it
  window.addEventListener(LANG_EVENT, callback); // this tab changed it
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANG_EVENT, callback);
  };
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeToLang,
    readStoredLang,
    () => "en" as Lang, // server + hydration snapshot (§35 default)
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("lang-bn", lang === "bn");
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode — the in-memory event still switches the UI */
    }
    window.dispatchEvent(new Event(LANG_EVENT));
  }, []);

  const t = useCallback(
    (key: MessageKey, params?: Record<string, string | number>) => {
      let message: string = DICTS[lang][key] ?? en[key] ?? key;
      if (params) {
        for (const [name, value] of Object.entries(params)) {
          message = message.replaceAll(`{${name}}`, String(value));
        }
      }
      return message;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}