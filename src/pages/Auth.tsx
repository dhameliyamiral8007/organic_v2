import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, Github, Chrome } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-[80vh] grid md:grid-cols-2">
      <aside className="hidden md:flex flex-col justify-between p-12 bg-hero text-primary-foreground relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid place-items-center h-10 w-10 rounded-full bg-accent text-accent-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl font-bold">Organic Nisarg</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold leading-tight">
            Join a community<br /> rooted in nature.
          </h2>
          <p className="opacity-85 mt-4 max-w-md">
            Track orders, save your favourites and unlock seasonal offers from trusted Indian farms.
          </p>
        </div>
        <p className="text-xs opacity-70">© Organic Nisarg · Pure · Natural · Trusted</p>
      </aside>

      <div className="flex items-center justify-center p-6 md:p-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-cream/30 pointer-events-none" />
        
        <form onSubmit={submit} className="w-full max-w-md relative z-10">
          <Link to="/" className="md:hidden flex items-center gap-2 mb-8">
            <span className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-bold">Organic Nisarg</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-primary">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {mode === "login" ? "Sign in to continue your healthy lifestyle." : "Start your organic journey with us today."}
            </p>
          </div>

          <div className="space-y-5">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="name"
                    value={form.name} 
                    onChange={set("name")} 
                    placeholder="John Doe" 
                    className="pl-10 h-11 border-border/60 focus:border-primary transition-all shadow-sm" 
                    required 
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email"
                  type="email" 
                  value={form.email} 
                  onChange={set("email")} 
                  placeholder="name@example.com" 
                  className="pl-10 h-11 border-border/60 focus:border-primary transition-all shadow-sm" 
                  required 
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone (optional)</Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="phone"
                    type="tel" 
                    value={form.phone} 
                    onChange={set("phone")} 
                    placeholder="+91 98765 43210" 
                    className="pl-10 h-11 border-border/60 focus:border-primary transition-all shadow-sm" 
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "login" && (
                  <Link to="/forgot-password" title="Coming soon" className="text-xs text-primary font-medium hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  value={form.password} 
                  onChange={set("password")} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10 h-11 border-border/60 focus:border-primary transition-all shadow-sm" 
                  required 
                  minLength={6} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            className="w-full mt-8 h-12 text-base shadow-elegant hover:scale-[1.01] active:scale-[0.99] transition-transform" 
            disabled={busy}
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === "login" ? "Sign in to account" : "Create my account"}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="h-11 border-border/60 hover:bg-secondary/50">
              <Chrome className="mr-2 h-4 w-4 text-destructive" />
              Google
            </Button>
            <Button variant="outline" type="button" className="h-11 border-border/60 hover:bg-secondary/50">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            {mode === "login" ? (
              <>
                New to Organic Nisarg?{" "}
                <Link to="/register" className="text-primary font-bold hover:underline decoration-primary/30 underline-offset-4">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline decoration-primary/30 underline-offset-4">
                  Sign in instead
                </Link>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
