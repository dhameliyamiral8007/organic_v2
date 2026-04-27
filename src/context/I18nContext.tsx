import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { dict, type DictKey, type Lang } from "@/i18n/translations";

const KEY = "nisarg_lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey | string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem(KEY) as Lang | null;
    return saved && ["en", "hi", "gu"].includes(saved) ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string, fallback?: string) => {
    const entry = (dict as any)[key];
    if (entry && entry[lang]) return entry[lang];
    return fallback ?? entry?.en ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: setLangState, t }}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
};
