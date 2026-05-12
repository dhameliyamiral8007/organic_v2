import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, Package, Mail, ShieldCheck, ArrowRight, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { effectivePrice, formatINR, productImage } from "@/lib/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, setToken } from "@/lib/api";

import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const detailsSchema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(60),
  lastName: z.string().trim().min(1, "Last name required").max(60),
  phone: z.string().trim().min(7, "Invalid phone").max(15),
  dob: z.string().trim().min(8, "Date of birth required"),
  address: z.string().trim().min(5, "Address too short").max(200),
  city: z.string().trim().min(1, "City required").max(80),
  zipCode: z.string().trim().min(3, "Invalid ZIP").max(12),
});

type Step = "email" | "otp" | "details" | "payment";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [details, setDetails] = useState({
    firstName: "", lastName: "", phone: "", dob: "",
    address: "", city: "", zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");



  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  if (items.length === 0 && !success) {
    return (
      <div className="container-wide py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <Button asChild variant="hero" className="mt-6"><Link to="/products">Shop now</Link></Button>
      </div>
    );
  }

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/api/checkout/send-otp", { email });
      setSessionId(res.data?.data?.sessionId);
      toast.success(`OTP sent to ${email}`);
      setStep("otp");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter the 6-digit code");
    setSubmitting(true);
    try {
      const res = await api.post("/api/checkout/verify-otp", { email, otp });
      const { sessionId, token, user } = res.data?.data || {};
      
      setSessionId(sessionId);
      if (token) setToken(token); // Store token for auto-login
      
      // Pre-fill details if user exists
      if (user) {
        setDetails(prev => ({
          ...prev,
          firstName: user.name?.split(' ')[0] || prev.firstName,
          lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
          phone: user.phone || prev.phone,
        }));
      }

      toast.success("Email verified");
      setStep("details");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid code, please try again");
    } finally {
      setSubmitting(false);
    }
  };



  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = detailsSchema.safeParse(details);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    
    setSubmitting(true);
    try {
      await api.post("/api/checkout/save-details", {
        sessionId,
        ...details
      });
      setStep("payment");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save details");
    } finally {
      setSubmitting(false);
    }
  };


  const placeOrder = async () => {
    setSubmitting(true);
    try {
      // 1. Create the internal order first (works for both COD and Online)
      const res = await api.post("/api/checkout/place-order", {
        sessionId,
        paymentMethod,
        guestItems: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          variantIndex: i.variantIndex,
          variantLabel: i.variantLabel
        }))
      });
      
      const orderData = res.data?.data || res.data;
      const orderId = orderData.id || orderData.orderId;

      if (paymentMethod === "online") {
        // 2. If online, create Razorpay order
        const rzpOrderRes = await api.post("/api/payments/create-order", {
          amount: total,
          receipt: `rcpt_${orderId}`
        });

        const rzpOrder = rzpOrderRes.data.order;

        const options = {
          key: (import.meta.env.VITE_RAZORPAY_KEY_ID as string) || "rzp_test_XXXXXXXXXXXXXX",
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Ba Prerna Nisarg",
          description: `Order #${orderData.orderNumber || orderId}`,
          order_id: rzpOrder.id,
          handler: async (response: any) => {
            try {
              await api.post("/api/payments/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId
              });
              clear();
              setSuccess(String(orderData.orderNumber || orderId));
            } catch (err: any) {
              toast.error("Payment verification failed, please contact support");
            }
          },
          prefill: {
            name: `${details.firstName} ${details.lastName}`,
            email: email,
            contact: details.phone
          },
          theme: { color: "#006400" } // Logo green/blue
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setSubmitting(false);
      } else {
        // 3. If COD, just show success
        clear();
        setSuccess(String(orderData.orderNumber || orderId));
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not place order");
    } finally {
      if (paymentMethod !== "online") {
        setSubmitting(false);
      }
    }
  };



  if (success) {
    return (
      <div className="container-wide py-20 text-center max-w-xl mx-auto">
        <div className="grid place-items-center h-20 w-20 rounded-full bg-leaf text-leaf-foreground mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="font-display text-4xl font-bold">Order placed!</h1>
        <p className="text-muted-foreground mt-3">
          Thank you for shopping with Ba Prerna Nisarg. We're packing your order with care.
        </p>
        {success !== "ORDER" && (
          <p className="text-sm mt-3">Order reference: <span className="font-mono font-semibold">{success}</span></p>
        )}
        <p className="text-xs text-muted-foreground mt-2">A confirmation has been sent to <strong>{email}</strong></p>
        <div className="flex gap-3 justify-center mt-8">
          <Button asChild variant="hero"><Link to="/products">Continue shopping</Link></Button>
          <Button asChild variant="outline" className="rounded-full" onClick={() => navigate("/")}><Link to="/">Back to home</Link></Button>
        </div>
      </div>
    );
  }

  const stepIndex = { email: 0, otp: 1, details: 2, payment: 3 }[step];

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{t("checkout.title")}</h1>
      <p className="text-muted-foreground mb-8">No account needed — just verify your email and you're set.</p>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { k: "email", label: "Email" },
          { k: "otp", label: "Verify" },
          { k: "details", label: "Details" },
          { k: "payment", label: "Payment" },
        ].map((s, i) => (
          <div key={s.k} className="flex items-center gap-2 shrink-0">
            <div className={`grid place-items-center h-8 w-8 rounded-full text-xs font-bold transition-smooth ${
              i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-sm font-medium ${i === stepIndex ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
            {i < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={sendOtp} className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Mail className="h-5 w-5" />
                <h2 className="font-display text-xl font-bold">{t("checkout.email")}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                We'll send a 6-digit verification code to confirm your email — no password, no signup.
              </p>
              <Label htmlFor="ck-email">Email *</Label>
              <Input
                id="ck-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 h-12"
                required
              />
              <Button type="submit" variant="hero" size="lg" className="mt-5 w-full" disabled={submitting}>
                {submitting ? "Sending..." : t("checkout.send_otp")}
              </Button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <form onSubmit={verifyOtp} className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 text-primary mb-2">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="font-display text-xl font-bold">Verify your email</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                {t("checkout.otp_sent")} <strong className="text-foreground">{email}</strong>
              </p>
              <Label htmlFor="ck-otp">6-digit code *</Label>
              <Input
                id="ck-otp"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="mt-1.5 h-12 text-center text-2xl tracking-[0.5em] font-mono"
                required
              />
              <div className="flex gap-3 mt-5">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("email")}>Change email</Button>
                <Button type="submit" variant="hero" className="flex-1">{t("checkout.verify")}</Button>
              </div>
              <button
                type="button"
                onClick={() => sendOtp(new Event("submit") as any)}
                className="block mx-auto mt-4 text-xs text-primary hover:underline"
              >
                Didn't receive it? Resend code
              </button>
            </form>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <form onSubmit={submitDetails} className="space-y-6">
              <section className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold mb-4">{t("checkout.details")}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First name *">
                    <Input value={details.firstName} onChange={(e) => setDetails({ ...details, firstName: e.target.value })} required />
                  </Field>
                  <Field label="Last name *">
                    <Input value={details.lastName} onChange={(e) => setDetails({ ...details, lastName: e.target.value })} required />
                  </Field>
                  <Field label="Contact number *">
                    <Input type="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} required />
                  </Field>
                  <Field label="Date of birth *">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
                            !details.dob && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {details.dob ? format(new Date(details.dob), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={details.dob ? new Date(details.dob) : undefined}
                          onSelect={(d) => setDetails({ ...details, dob: d ? format(d, "yyyy-MM-dd") : "" })}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={new Date().getFullYear() + 10}
                          classNames={{
                            caption_label: "hidden",
                          }}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>
              </section>

              <section className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-display text-xl font-bold mb-4">{t("checkout.address")}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Address *" className="sm:col-span-2">
                    <Input value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} required />
                  </Field>
                  <Field label="City *">
                    <Input value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} required />
                  </Field>
                  <Field label="ZIP / PIN code *">
                    <Input value={details.zipCode} onChange={(e) => setDetails({ ...details, zipCode: e.target.value })} required />
                  </Field>
                </div>
              </section>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("otp")}>Back</Button>
                <Button type="submit" variant="hero" size="lg" className="flex-1">Continue to payment</Button>
              </div>
            </form>
          )}

          {/* Step 4: Payment */}
          {step === "payment" && (
            <section className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold mb-4">{t("checkout.payment")}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <PayOption
                  active={paymentMethod === "cod"}
                  onClick={() => setPaymentMethod("cod")}
                  icon={<Package className="h-5 w-5" />}
                  title="Cash on Delivery"
                  desc="Pay when your order arrives"
                />
                <PayOption
                  active={paymentMethod === "online"}
                  onClick={() => setPaymentMethod("online")}
                  icon={<CreditCard className="h-5 w-5" />}
                  title="Secure Payment"
                  desc="UPI / Cards / NetBanking"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep("details")}>Back</Button>
                <Button type="button" variant="hero" size="lg" className="flex-1" onClick={placeOrder} disabled={submitting}>
                  {submitting ? "Placing order..." : `${t("checkout.place_order")} · ${formatINR(total)}`}
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* Summary */}
        <aside className="bg-card border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-32">
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <ul className="space-y-3 max-h-72 overflow-auto pr-1">
            {items.map((i) => (
              <li key={`${i.productId}-${i.variantIndex ?? 0}`} className="flex gap-3">
                <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img src={productImage(i.product, i.variantIndex)} alt={i.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{i.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {i.quantity}</p>
                </div>
                <p className="text-sm font-semibold">{formatINR(effectivePrice(i.product, i.variantIndex) * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
            <div className="flex justify-between text-lg pt-2 border-t border-border">
              <dt className="font-semibold">Total</dt>
              <dd className="font-display font-bold text-primary">{formatINR(total)}</dd>
            </div>
          </dl>
          <div className="mt-5 p-3 bg-secondary rounded-lg text-xs text-secondary-foreground flex gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
            <span>Secure checkout · Email verified · No account required</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</Label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const PayOption = ({
  active, onClick, icon, title, desc,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left rounded-xl border-2 p-4 transition-smooth ${
      active ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"
    }`}
  >
    <div className="flex items-center gap-2 font-semibold">{icon} {title}</div>
    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
  </button>
);

export default Checkout;
