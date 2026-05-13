import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X, Copy, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import bannerImg from "@/assets/banner-categories.jpg";

const STORAGE_KEY = "coupon_popup_dismissed_v1";
const CODE = "NISARG10";

export const CouponPopup = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); }}>
      <DialogContent
        className="p-0 overflow-hidden border-none max-w-md sm:max-w-lg rounded-3xl"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 h-9 w-9 grid place-items-center rounded-full bg-background/90 hover:bg-background shadow-md text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative">
          <div className="relative h-44 sm:h-52 overflow-hidden">
            <img src={bannerImg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-primary/85" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] shadow-lg">
                <Sparkles className="h-3.5 w-3.5" /> Welcome offer
              </span>
            </div>
          </div>

          <div className="bg-card text-card-foreground px-6 sm:px-8 pt-6 pb-7 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary leading-tight">
              The cleanest pantry, on us.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Get <span className="font-bold text-foreground">10% off</span> your first order.
              Use the code below at checkout.
            </p>

            <div className="mt-5 mx-auto max-w-xs">
              <div className="flex items-stretch rounded-full border-2 border-dashed border-accent/60 bg-accent/5 overflow-hidden">
                <div className="flex-1 px-5 py-3 font-display text-xl font-bold tracking-[0.25em] text-primary">
                  {CODE}
                </div>
                <button
                  onClick={copy}
                  className="px-4 bg-accent text-accent-foreground font-semibold text-sm flex items-center gap-1.5 hover:brightness-105 transition-smooth"
                  aria-label="Copy code"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <Button asChild variant="hero" size="lg" className="mt-6 w-full sm:w-auto">
              <Link to="/products" onClick={close}>
                Start shopping
              </Link>
            </Button>

            <button
              onClick={close}
              className="block mx-auto mt-3 text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
            >
              No thanks
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
