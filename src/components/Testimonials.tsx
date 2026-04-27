import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import { useI18n } from "@/context/I18nContext";

interface Testimonial {
  _id?: string;
  name: string;
  content: string;
  designation?: string;
  rating?: number;
  avatar?: string;
}

const FALLBACK: Testimonial[] = [
  { name: "Priya Shah", content: "The vermicompost transformed my balcony garden. Tomatoes have never tasted better!", designation: "Home Grower, Ahmedabad", rating: 5 },
  { name: "Ramesh Patel", content: "Reliable, certified organic, and farmer-friendly pricing. We use them for our entire farm.", designation: "Farmer, Mehsana", rating: 5 },
  { name: "Anjali Mehta", content: "Fast delivery, beautiful packaging, and the quality speaks for itself.", designation: "Customer, Mumbai", rating: 5 },
];

const fetchTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const data = unwrap<any>(await api.get("/api/testimonials"));
    const list = Array.isArray(data) ? data : data?.testimonials || [];
    return list.length ? list : FALLBACK;
  } catch {
    return FALLBACK;
  }
};

export const Testimonials = () => {
  const { t } = useI18n();
  const { data } = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials });
  const list = (data || []).slice(0, 6);

  return (
    <section className="bg-secondary border-y border-border">
      <div className="container-wide py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-accent font-semibold">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">{t("section.testimonials")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {list.map((tt, i) => (
            <article key={tt._id || i} className="bg-card border border-border rounded-2xl p-6 shadow-soft relative">
              <Quote className="h-8 w-8 text-accent/30 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: tt.rating || 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed">"{tt.content}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                  {tt.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{tt.name}</div>
                  {tt.designation && <div className="text-xs text-muted-foreground">{tt.designation}</div>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
