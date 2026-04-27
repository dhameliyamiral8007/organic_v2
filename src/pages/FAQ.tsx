import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { api, unwrap } from "@/lib/api";

interface FaqItem { _id?: string; question: string; answer: string; category?: string }

const FALLBACK: FaqItem[] = [
  { question: "Are your products 100% organic?", answer: "Yes. All products are sourced from certified organic farms.", category: "Products" },
  { question: "What is the delivery time?", answer: "3–5 business days across India. Metro cities often within 48 hours.", category: "Delivery" },
  { question: "Is there free delivery?", answer: "Orders above ₹499 ship free anywhere in India.", category: "Delivery" },
  { question: "Do you offer bulk pricing?", answer: "Yes. Use the Contact page to request a wholesale quote.", category: "Bulk" },
  { question: "What is Jivdaya Trust?", answer: "Our partner NGO that rescues and cares for stray animals.", category: "Trust" },
];

const fetchFaqs = async (): Promise<FaqItem[]> => {
  try {
    const data = unwrap<any>(await api.get("/api/faqs"));
    const list = Array.isArray(data) ? data : data?.faqs || [];
    return list.length ? list : FALLBACK;
  } catch {
    return FALLBACK;
  }
};

const FAQPage = () => {
  const { data: faqs } = useQuery({ queryKey: ["faqs"], queryFn: fetchFaqs });
  const list = faqs || [];
  const grouped = list.reduce<Record<string, FaqItem[]>>((acc, f) => {
    const key = f.category || "General";
    (acc[key] ||= []).push(f);
    return acc;
  }, {});

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-wide py-14 md:py-20">
          <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em]">
            <HelpCircle className="h-3.5 w-3.5 text-accent" /> Help Center
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-5">Frequently asked questions</h1>
          <p className="mt-3 max-w-2xl opacity-90">Everything you need to know before, during and after your order.</p>
        </div>
      </section>

      <section className="container-wide py-16 max-w-4xl">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="mb-10">
            <h2 className="font-display text-2xl font-bold mb-4 text-primary">{cat}</h2>
            <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
              {items.map((item, i) => (
                <AccordionItem key={item._id || i} value={`${cat}-${i}`} className="px-5 border-0">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>
    </>
  );
};

export default FAQPage;
