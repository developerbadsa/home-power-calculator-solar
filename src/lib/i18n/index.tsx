"use client";

/**
 * Lightweight i18n (§35): a React context holding the active language with a
 * typed `t(key, params?)` function. Labels and copy live in the dictionaries;
 * components never hard-code user-facing strings.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, type MessageKey } from "./en";
import { bn } from "./bn";

export type Lang = "en" | "bn";

const DICTS: Record<Lang, import("./en").Dict> = { en, bn };
const STORAGE_KEY = "hpc-lang";

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a key, interpolating {params}. */
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "bn" || saved === "en" ? saved : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("lang-bn", lang === "bn");
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode — fine */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

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