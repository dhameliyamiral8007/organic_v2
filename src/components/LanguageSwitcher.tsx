import { Globe } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { LANGUAGES } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const LanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-primary-foreground/10 transition-smooth text-xs font-semibold">
        <Globe className="h-4 w-4" />
        {current.native}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={l.code === lang ? "bg-secondary font-semibold" : ""}
          >
            {l.native} <span className="ml-auto text-xs text-muted-foreground">{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
