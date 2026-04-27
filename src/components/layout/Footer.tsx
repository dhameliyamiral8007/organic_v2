import { Leaf, Mail, Phone, MapPin, Send, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import { OFFICES } from "@/lib/offices";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().trim().email().max(255).safeParse(email);
    if (!parsed.success) return toast.error("Enter a valid email");
    setLoading(true);
    try {
      await api.post("/api/subscribers", { email });
      toast.success("Subscribed! Welcome to the harvest letter 🌱");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message || "Could not subscribe");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex w-full max-w-sm rounded-full overflow-hidden bg-primary-foreground/10 border border-primary-foreground/20">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 px-4 py-2.5 bg-transparent text-sm outline-none placeholder:text-primary-foreground/50"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 bg-accent text-accent-foreground hover:brightness-105 transition-smooth disabled:opacity-50"
        aria-label="Subscribe"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
};

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-24">
    <div className="container-wide py-14 grid gap-10 md:grid-cols-4">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-accent text-accent-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold">Ba Prerna Nisarg</span>
        </div>
        <p className="text-sm opacity-80 leading-relaxed">
          100% organic fertilizers and farm produce from trusted Indian farms — straight to your doorstep.
        </p>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.18em] opacity-70 mb-2">Get updates</p>
          <Subscribe />
        </div>
      </div>

      <div>
        <h4 className="font-display text-base mb-4 text-accent">Shop</h4>
        <ul className="space-y-2 text-sm opacity-90">
          <li><Link to="/products" className="hover:text-accent">All Products</Link></li>
          <li><Link to="/products?category=fertilizer" className="hover:text-accent">Organic Fertilizer</Link></li>
          <li><Link to="/products?category=herbs" className="hover:text-accent">Herbs & Spices</Link></li>
          <li><Link to="/wishlist" className="hover:text-accent">Wishlist</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-base mb-4 text-accent">Company</h4>
        <ul className="space-y-2 text-sm opacity-90">
          <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
          <li><Link to="/blog" className="hover:text-accent">Knowledge Center</Link></li>
          <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
          <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display text-base mb-4 text-accent">Get in touch</h4>
        <ul className="space-y-3 text-sm opacity-90">
          <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> Gujarat, India</li>
          <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /> hello@baprerna.com</li>
          <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /> +91 98000 12345</li>
        </ul>
      </div>
    </div>



    <div className="border-t border-primary-foreground/10">
      <div className="container-wide py-5 text-xs opacity-70 flex flex-col md:flex-row gap-2 justify-between">
        <span>© {new Date().getFullYear()} Ba Prerna Nisarg CleanEarth. All rights reserved.</span>
        <span>Crafted with care · 100% Certified Organic · Supports Jivdaya Trust</span>
      </div>
    </div>
  </footer>
);
