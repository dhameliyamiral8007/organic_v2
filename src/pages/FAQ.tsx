import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, ChevronRight, MessageCircle, Package, RefreshCcw, ShoppingBag, Zap } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import { cn } from "@/lib/utils";

interface FaqItem { 
  id: string; 
  question: string; 
  answer: string; 
  category: string;
  is_active?: boolean;
}

// Fallback grouped by category to match the API structure
const FALLBACK: Record<string, FaqItem[]> = {
  "Products": [
    { id: "p1", question: "Are your products 100% organic?", answer: "Yes. All products are sourced from certified organic farms, rigorously tested for chemical residues.", category: "Products" },
    { id: "p2", question: "How to use Nisarg Shakti?", answer: "Apply 50-100g per plant every 15 days. For best results, mix with topsoil and water immediately.", category: "Products" },
  ],
  "Ordering": [
    { id: "o1", question: "How I can buy this product?", answer: "Simply add items to your cart, click checkout, and follow the instructions for payment.", category: "Ordering" },
    { id: "o2", question: "What payment methods are supported?", answer: "We support UPI, Credit/Debit Cards, Net Banking, and select Wallets.", category: "Ordering" },
  ],
  "Delivery": [
    { id: "d1", question: "What is the delivery time?", answer: "3–5 business days across India. Metro cities often within 48 hours.", category: "Delivery" },
    { id: "d2", question: "Is there free delivery?", answer: "Orders above ₹499 ship free anywhere in India.", category: "Delivery" },
  ],
  "Returns": [
    { id: "r1", question: "How I can return my product?", answer: "You can initiate a return within 7 days of delivery through your profile or by contacting support.", category: "Returns" },
    { id: "r2", question: "What is the refund process?", answer: "Refunds are processed within 5-7 working days once the product is received back.", category: "Returns" },
  ],
};

const fetchFaqs = async (): Promise<Record<string, FaqItem[]>> => {
  try {
    const data = unwrap<any>(await api.get("/api/faqs"));
    // The API returns an object where keys are categories
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return Object.keys(data).length ? data : FALLBACK;
    }
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
};

const CATEGORY_ICONS: Record<string, any> = {
  "Products": Zap,
  "Shakti Fertiliser": Zap,
  "Ordering": ShoppingBag,
  "Delivery": Package,
  "Returns": RefreshCcw,
  "Trust": HelpCircle,
};

const FAQPage = () => {
  const { data: groupedFaqs, isLoading } = useQuery({ 
    queryKey: ["faqs"], 
    queryFn: fetchFaqs 
  });

  const categories = useMemo(() => Object.keys(groupedFaqs || {}), [groupedFaqs]);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Set first category as active when data loads
  useMemo(() => {
    if (categories.length && !activeTab) {
      setActiveTab(categories[0]);
    }
  }, [categories, activeTab]);

  const activeItems = activeTab ? (groupedFaqs?.[activeTab] || []) : [];

  return (
    <div className="bg-secondary/30 min-h-screen">
      <section className="bg-primary text-primary-foreground">
        <div className="container-wide py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em] font-semibold">
              <HelpCircle className="h-3.5 w-3.5 text-accent" /> Help Center
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mt-6 leading-tight">
              How can we <span className="text-accent italic">help</span> you?
            </h1>
            <p className="mt-5 text-lg opacity-80 leading-relaxed">
              Find answers to common questions about our products, delivery, and mission. 
              Can't find what you're looking for? Reach out to our support team.
            </p>
          </div>
        </div>
      </section>

      <section className="container-wide py-12 md:py-20">
        <div className="grid lg:grid-cols-[300px,1fr] gap-10 items-start">
          
          {/* Sidebar */}
          <aside className="space-y-2 sticky top-24">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground px-4 mb-4">
              Categories
            </h3>
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || MessageCircle;
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-elegant scale-[1.02]" 
                      : "bg-card hover:bg-secondary/80 text-foreground border border-border/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl transition-colors",
                      isActive ? "bg-accent/20 text-accent" : "bg-secondary text-primary"
                    )}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="font-semibold text-sm">{cat}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isActive ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </button>
              );
            })}
          </aside>

          {/* Main Content */}
          <main className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 w-full bg-card animate-pulse rounded-2xl border border-border" />
                ))}
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-1.5 bg-accent rounded-full" />
                  <div>
                    <h2 className="font-display text-3xl font-bold text-primary">{activeTab}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activeItems.length} {activeItems.length === 1 ? "Question" : "Questions"} found
                    </p>
                  </div>
                </div>

                <Accordion 
                  type="single" 
                  collapsible 
                  className="space-y-4"
                >
                  {activeItems.map((item, i) => (
                    <AccordionItem 
                      key={item.id || i} 
                      value={`item-${i}`} 
                      className="bg-card border border-border rounded-2xl px-6 py-1 hover:border-primary/50 hover:shadow-soft transition-all duration-300"
                    >
                      <AccordionTrigger className="text-left font-bold text-base md:text-lg py-5 hover:no-underline hover:text-primary transition-colors">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-6 whitespace-pre-wrap border-t border-border/50 pt-4 mt-1">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {activeItems.length === 0 && (
                  <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                    <p className="text-muted-foreground">No questions found in this category.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Help Banner */}
      <section className="container-wide pb-20">
        <div className="bg-primary-glow rounded-3xl p-10 md:p-14 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <MessageCircle className="h-40 w-40" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold relative z-10">Still have questions?</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto relative z-10">
            Our team is here to help you with anything you need. Reach out to us directly for personalized assistance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 relative z-10">
            <button className="bg-accent text-accent-foreground px-8 py-3 rounded-full font-bold hover:brightness-105 transition-smooth">
              Contact Support
            </button>
            <button className="bg-primary-foreground/10 backdrop-blur px-8 py-3 rounded-full font-bold hover:bg-primary-foreground/20 transition-smooth">
              Email Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
