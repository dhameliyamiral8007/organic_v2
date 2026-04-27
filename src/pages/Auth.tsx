import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
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

      <div className="grid place-items-center p-6 md:p-12 bg-background">
        <form onSubmit={submit} className="w-full max-w-md">
          <Link to="/" className="md:hidden flex items-center gap-2 mb-6">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-display text-xl font-bold">Organic Nisarg</span>
          </Link>
          <h1 className="font-display text-3xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === "login" ? "Sign in to continue shopping." : "Start your organic journey today."}
          </p>

          <div className="space-y-4 mt-8">
            {mode === "register" && (
              <div>
                <Label>Full name</Label>
                <Input value={form.name} onChange={set("name")} placeholder="Your name" className="mt-1.5" required />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="mt-1.5" required />
            </div>
            {mode === "register" && (
              <div>
                <Label>Phone (optional)</Label>
                <Input type="tel" value={form.phone} onChange={set("phone")} placeholder="9876543210" className="mt-1.5" />
              </div>
            )}
            <div>
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={set("password")} placeholder="••••••••" className="mt-1.5" required minLength={6} />
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            {mode === "login" ? (
              <>New here?{" "}<Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link></>
            ) : (
              <>Already have an account?{" "}<Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
