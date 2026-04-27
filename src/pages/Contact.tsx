import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OfficesGrid from "@/components/OfficesGrid";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  type: z.enum(["general", "bulk", "support"]),
  message: z.string().trim().min(10, "Please describe in at least 10 characters").max(1000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "general", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", phone: "", type: "general", message: "" });
  };

  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-wide py-14 md:py-20">
          <h1 className="font-display text-4xl md:text-6xl font-bold">Let's talk</h1>
          <p className="mt-3 max-w-2xl opacity-90">
            Bulk inquiries, partnerships, product questions or just want to say hi — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="container-wide py-16 grid lg:grid-cols-3 gap-8">
        <div className="space-y-4 lg:col-span-1">
          {[
            { icon: MapPin, t: "Visit us", d: "Pune, Maharashtra, India" },
            { icon: Mail, t: "Email", d: "hello@organicnisarg.com" },
            { icon: Phone, t: "Call", d: "+91 98000 12345" },
            { icon: MessageSquare, t: "Bulk Inquiries", d: "bulk@organicnisarg.com" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="p-5 rounded-2xl border border-border bg-card flex gap-4 items-start">
              <span className="grid place-items-center h-11 w-11 rounded-full bg-primary text-primary-foreground shrink-0">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">{t}</div>
                <div className="text-sm text-muted-foreground">{d}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="lg:col-span-2 p-8 rounded-2xl border border-border bg-card shadow-soft space-y-5">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="type">Inquiry type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger id="type" className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="general">General question</SelectItem>
                  <SelectItem value="bulk">Bulk order / wholesale</SelectItem>
                  <SelectItem value="support">Order support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={loading}>
            <Send className="h-4 w-4 mr-2" /> {loading ? "Sending..." : "Send message"}
          </Button>
        </form>
      </section>

      <div className="bg-muted/30 border-y border-border">
        <OfficesGrid />
      </div>
    </>
  );
};

export default Contact;
