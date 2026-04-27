import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import heroImg from "@/assets/hero-organic.jpg";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(100),
});
const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Name too short").max(80),
  phone: z.string().trim().min(7, "Invalid").max(15).optional().or(z.literal("")),
});

const Auth = ({ mode }: { mode: "login" | "register" }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        const parsed = loginSchema.safeParse({ email: form.email, password: form.password });
        if (!parsed.success) return toast.error(parsed.error.issues[0].message);
        setBusy(true);
        await login(form.email, form.password);
        toast.success("Welcome back!");
      } else {
        const parsed = registerSchema.safeParse(form);
        if (!parsed.success) return toast.error(parsed.error.issues[0].message);
        setBusy(true);
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
        });
        toast.success("Account created!");
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImg} 
          alt="Organic background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 bg-background/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Left Side - Hero Content */}
        <aside className="hidden md:flex flex-col justify-between p-12 bg-hero text-primary-foreground relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-accent text-accent-foreground">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">Organic Nisarg</span>
            </Link>
            
            <div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
                Join a community<br /> <span className="text-accent">rooted</span> in nature.
              </h2>
              <p className="opacity-80 mt-6 text-lg max-w-sm leading-relaxed">
                Experience the purest organic produce delivered directly from local farms to your doorstep.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-sm font-medium opacity-70">
              <span>Pure</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Natural</span>
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span>Trusted</span>
            </div>
            <p className="text-xs opacity-50 mt-4">© 2026 Organic Nisarg. All rights reserved.</p>
          </div>

          {/* Decorative element */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        </aside>

        {/* Right Side - Form */}
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <Link to="/" className="md:hidden flex items-center gap-2 mb-6">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="font-display text-xl font-bold">Organic Nisarg</span>
            </Link>

            <h1 className="font-display text-3xl font-bold text-primary tracking-tight">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {mode === "login" ? "Please enter your details to sign in." : "Start your organic journey with us today."}
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider opacity-70">Full name</Label>
                <Input 
                  id="name"
                  value={form.name} 
                  onChange={set("name")} 
                  placeholder="John Doe" 
                  className="h-10 border-border/60 focus:border-primary transition-all text-sm" 
                  required 
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider opacity-70">Email address</Label>
              <Input 
                id="email"
                type="email" 
                value={form.email} 
                onChange={set("email")} 
                placeholder="name@example.com" 
                className="h-10 border-border/60 focus:border-primary transition-all text-sm" 
                required 
              />
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider opacity-70">Phone number (optional)</Label>
                <Input 
                  id="phone"
                  type="tel" 
                  value={form.phone} 
                  onChange={set("phone")} 
                  placeholder="+91 98765 43210" 
                  className="h-10 border-border/60 focus:border-primary transition-all text-sm" 
                />
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider opacity-70">Password</Label>
                {mode === "login" && (
                  <Link to="/forgot-password" title="Coming soon" className="text-[10px] text-primary font-bold hover:underline uppercase tracking-tighter">
                    Forgot?
                  </Link>
                )}
              </div>
              <Input 
                id="password"
                type="password" 
                value={form.password} 
                onChange={set("password")} 
                placeholder="••••••••" 
                className="h-10 border-border/60 focus:border-primary transition-all text-sm" 
                required 
                minLength={6} 
              />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full h-11 text-sm mt-2 shadow-elegant" disabled={busy}>
              {busy ? "Processing..." : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            {mode === "login" ? (
              <>
                New to Nisarg?{" "}
                <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">
                  Register now
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
                  Login here
                </Link>
              </>
            )}
          </p>

          <Button asChild variant="ghost" size="sm" className="mt-6 self-center text-muted-foreground hover:text-primary h-8 text-xs">
            <Link to="/">
              <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
