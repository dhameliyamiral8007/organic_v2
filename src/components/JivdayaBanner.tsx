import { Heart, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import jivdayaImg from "@/assets/jivdaya.jpg";

export const JivdayaBanner = () => {
  const { t } = useI18n();
  return (
    <section className="container-wide pb-16">
      <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Left content */}
          <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 self-start bg-accent/10 text-accent px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em]">
              <Heart className="h-3.5 w-3.5 fill-accent" /> {t("jivdaya.badge")}
            </span>

            <h2 className="font-display text-3xl md:text-5xl font-bold mt-5 leading-tight">
              <span className="text-primary">{t("jivdaya.title.a")}</span>
              <br />
              <span className="text-accent relative inline-block">
                {t("jivdaya.title.b")}
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 4 Q 25 0, 50 4 T 100 4 T 150 4 T 200 4" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" opacity="0.5" />
                </svg>
              </span>
            </h2>

            <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
              {t("jivdaya.subtitle")}
            </p>

            {/* Stats card */}
            <div className="mt-8 grid sm:grid-cols-2 gap-0 rounded-2xl border border-border bg-secondary/30 overflow-hidden">
              <div className="p-5 flex items-center gap-4 sm:border-r border-border">
                <div className="h-14 w-14 shrink-0 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-display font-bold text-lg">
                  20%
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary leading-snug">
                  {t("jivdaya.stats.order")}
                </div>
              </div>
              <div className="p-5 text-sm text-muted-foreground italic">
                "{t("jivdaya.stats.rescue")}"
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/donate">
                  {t("jivdaya.cta.donate")} <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/about">
                  {t("jivdaya.cta.learn")} <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right image */}
          <div className="relative min-h-[320px] lg:min-h-full bg-secondary">
            <img src={jivdayaImg} alt="Jivdaya Trust volunteers caring for rescued birds" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:max-w-xs bg-card/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
              <div className="h-9 w-9 rounded-full bg-accent/15 flex items-center justify-center mb-3">
                <Heart className="h-4 w-4 text-accent" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{t("jivdaya.fact.badge")}</p>
              <p className="mt-2 text-sm font-semibold text-primary leading-snug">
                {t("jivdaya.fact.text")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

