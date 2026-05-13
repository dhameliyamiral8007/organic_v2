import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import heroImg from "@/assets/hero-organic.jpg";
import bannerImg from "@/assets/banner-categories.jpg";
import jivdayaImg from "@/assets/jivdaya.jpg";

type Slide = {
  img: string;
  badge: string;
  titleA: string;
  titleB: string;
  titleC: string;
  subtitle: string;
  cta: string;
  ctaTo: string;
  altCta?: string;
  altTo?: string;
};

export const HeroSlider = () => {
  const { t } = useI18n();

  const slides: Slide[] = [
    {
      img: heroImg,
      badge: t("hero.badge"),
      titleA: t("hero.title.a"),
      titleB: t("hero.title.b"),
      titleC: t("hero.title.c"),
      subtitle: t("hero.subtitle"),
      cta: t("hero.cta"),
      ctaTo: "/products",
      altCta: t("hero.browse_fruits"),
      altTo: "/products?category=fruits",
    },
    {
      img: bannerImg,
      badge: "Limited Offer",
      titleA: "The cleanest pantry,",
      titleB: "on us.",
      titleC: "",
      subtitle: "Get 10% off your first order with code NISARG10 — fresh staples delivered to your door.",
      cta: "Start shopping",
      ctaTo: "/products",
      altCta: "View pantry",
      altTo: "/products?category=pantry",
    },
    {
      img: jivdayaImg,
      badge: "Jivdaya · Give Back",
      titleA: "Every order",
      titleB: "saves a life.",
      titleC: "",
      subtitle: "20% of every order supports rescued birds and animals through our Jivdaya programme.",
      cta: "Donate now",
      ctaTo: "/donate",
      altCta: "Learn more",
      altTo: "/about",
    },
  ];

  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5500, stopOnInteraction: false })]
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSel = () => setSelected(embla.selectedScrollSnap());
    onSel();
    embla.on("select", onSel);
    return () => { embla.off("select", onSel); };
  }, [embla]);

  return (
    <section className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div key={i} className="relative min-w-0 shrink-0 grow-0 basis-full">
              <div className="relative h-[480px] md:h-[620px] overflow-hidden">
                <img
                  src={s.img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  width={1920}
                  height={1280}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
                <div className="relative container-wide h-full flex items-center text-primary-foreground">
                  <div className="max-w-2xl py-16">
                    <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em]">
                      <Leaf className="h-3.5 w-3.5 text-accent" /> {s.badge}
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-6 leading-[1.05]">
                      {s.titleA} <span className="text-accent">{s.titleB}</span> {s.titleC}
                    </h1>
                    <p className="mt-5 text-base md:text-lg opacity-90 max-w-xl leading-relaxed">{s.subtitle}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button asChild variant="hero" size="lg">
                        <Link to={s.ctaTo}>{s.cta} <ArrowRight className="h-4 w-4 ml-1" /></Link>
                      </Button>
                      {s.altCta && s.altTo && (
                        <Button asChild variant="outline" size="lg" className="rounded-full bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                          <Link to={s.altTo}>{s.altCta}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              selected === i ? "w-8 bg-accent" : "w-2 bg-primary-foreground/50 hover:bg-primary-foreground/80"
            )}
          />
        ))}
      </div>
    </section>
  );
};
