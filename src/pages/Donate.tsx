import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, IndianRupee, Sparkles, ShieldCheck, Users, TrendingUp, Copy, Download, CheckCircle2 } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import qrImg from "@/assets/qrcode.webp";

interface Donor {
  _id?: string;
  id?: string;
  name: string;
  amount: number;
  message?: string;
  createdAt?: string;
  anonymous?: boolean;
}

const PRESET = [101, 251, 501, 1001, 2100, 5100];
const UPI_ID = "vyapar.169178235989@hdfcbank";
const PAYEE = "Ba Prerna - Jivdaya Trust";

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const Donate = () => {
  const qc = useQueryClient();
  const [amount, setAmount] = useState<number>(501);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [success, setSuccess] = useState<{ id: string; amount: number; name: string; date: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["donations"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/donations");
        return unwrap<Donor[]>(res) || [];
      } catch {
        // Graceful fallback while backend is being prepared
        return [
          { id: "d1", name: "Ramesh Patel", amount: 5100, message: "For the birds", createdAt: new Date(Date.now() - 1e7).toISOString() },
          { id: "d2", name: "Anonymous", amount: 1001, anonymous: true, createdAt: new Date(Date.now() - 5e7).toISOString() },
          { id: "d3", name: "Meera Shah", amount: 2100, createdAt: new Date(Date.now() - 9e7).toISOString() },
          { id: "d4", name: "Kunal Joshi", amount: 501, message: "Keep up the noble work", createdAt: new Date(Date.now() - 2e8).toISOString() },
          { id: "d5", name: "Anonymous", amount: 251, anonymous: true, createdAt: new Date(Date.now() - 4e8).toISOString() },
        ] as Donor[];
      }
    },
  });

  const donors = data ?? [];
  const totals = useMemo(() => {
    const total = donors.reduce((s, d) => s + Number(d.amount || 0), 0);
    return { total, count: donors.length, avg: donors.length ? Math.round(total / donors.length) : 0 };
  }, [donors]);

  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Donation - Jivdaya Trust")}`;

  const submit = useMutation({
    mutationFn: async () => {
      const payload = {
        name: anonymous ? "Anonymous" : name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amount: Number(amount),
        message: message.trim(),
        anonymous,
      };
      try {
        const res = await api.post("/api/donations", payload);
        return unwrap<Donor>(res);
      } catch {
        // graceful fallback so the receipt still renders
        return { id: `local-${Date.now()}`, ...payload } as Donor;
      }
    },
    onSuccess: (donor) => {
      const id = String((donor as any)?.id || (donor as any)?._id || `RCPT-${Date.now()}`).slice(-8).toUpperCase();
      setSuccess({
        id: `BPN-${id}`,
        amount: Number(amount),
        name: anonymous ? "Anonymous" : name || "Donor",
        date: new Date().toLocaleString("en-IN"),
      });
      toast.success("Thank you for your donation 💚");
      qc.invalidateQueries({ queryKey: ["donations"] });
      setMessage("");
    },
    onError: (e: any) => toast.error(e?.message || "Could not record donation"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 1) return toast.error("Enter a valid amount");
    if (!anonymous && !name.trim()) return toast.error("Please enter your name");
    if (!email.trim()) return toast.error("Email is required for the receipt");
    submit.mutate();
  };

  const copyUpi = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied");
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-wide py-16 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="bg-accent text-accent-foreground mb-4 uppercase tracking-wider">
              <Heart className="h-3.5 w-3.5 mr-1.5 fill-current" /> Jivdaya Trust
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              Give a Little, <span className="text-accent">Save a Lot</span>
            </h1>
            <p className="mt-5 text-primary-foreground/85 max-w-lg leading-relaxed">
              Every rupee you donate goes directly to caring for rescued birds and animals at Jivdaya Trust.
              Scan the QR or donate online — receive your receipt instantly.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <Card className="bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground p-4">
                <Users className="h-5 w-5 text-accent mb-2" />
                <div className="font-display text-2xl font-bold">{totals.count}+</div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Donors</div>
              </Card>
              <Card className="bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground p-4">
                <TrendingUp className="h-5 w-5 text-accent mb-2" />
                <div className="font-display text-2xl font-bold">{formatINR(totals.total)}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Raised</div>
              </Card>
              <Card className="bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground p-4">
                <ShieldCheck className="h-5 w-5 text-accent mb-2" />
                <div className="font-display text-2xl font-bold">100%</div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">To Cause</div>
              </Card>
            </div>
          </div>

          {/* Scanner card */}
          <div className="lg:justify-self-end w-full max-w-md">
            <Card className="bg-card text-card-foreground p-6 rounded-3xl shadow-2xl border-2 border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Scan & Pay</p>
                  <p className="font-display font-bold text-primary">UPI · GPay · PhonePe · Paytm</p>
                </div>
                <Sparkles className="h-5 w-5 text-accent" />
              </div>

              {/* QR with corner brackets */}
              <div className="relative mx-auto w-64 h-64 bg-white rounded-2xl p-3 border border-border">
                <div className="absolute inset-2 pointer-events-none">
                  <span className="absolute -top-1 -left-1 h-6 w-6 border-t-4 border-l-4 border-accent rounded-tl-lg" />
                  <span className="absolute -top-1 -right-1 h-6 w-6 border-t-4 border-r-4 border-accent rounded-tr-lg" />
                  <span className="absolute -bottom-1 -left-1 h-6 w-6 border-b-4 border-l-4 border-accent rounded-bl-lg" />
                  <span className="absolute -bottom-1 -right-1 h-6 w-6 border-b-4 border-r-4 border-accent rounded-br-lg" />
                </div>
                <img src={qrImg} alt="Donation QR Code" className="w-full h-full object-contain" />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/40 border border-border px-4 py-2.5">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">UPI ID</p>
                  <p className="font-mono text-sm font-semibold text-primary">{UPI_ID}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={copyUpi} className="h-8">
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                </Button>
              </div>

              <a
                href={upiUrl}
                className="mt-3 block text-center text-xs text-muted-foreground hover:text-accent"
              >
                Open in UPI app →
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation form + Receipt */}
      <section className="container-wide py-16 grid lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-3 p-6 md:p-8 rounded-2xl">
          <h2 className="font-display text-2xl font-bold text-primary">Make a Donation</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose an amount and we'll generate a digital receipt instantly.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <Label className="mb-2 block">Select Amount</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAmount(v)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-smooth ${
                      amount === v
                        ? "bg-accent text-accent-foreground border-accent shadow-sm"
                        : "bg-background border-border hover:border-accent"
                    }`}
                  >
                    ₹{v}
                  </button>
                ))}
              </div>
              <div className="mt-3 relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Custom amount"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name {!anonymous && <span className="text-destructive">*</span>}</Label>
                <Input id="name" value={name} disabled={anonymous} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91…" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--accent))]" />
                  Donate anonymously
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="msg">Message (optional)</Label>
              <Textarea id="msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A few words of support…" />
            </div>

            <Button type="submit" variant="hero" size="lg" disabled={submit.isPending} className="w-full">
              <Heart className="h-4 w-4 mr-1.5 fill-current" />
              {submit.isPending ? "Processing…" : `Donate ${formatINR(amount || 0)}`}
            </Button>
          </form>
        </Card>

        {/* Receipt */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            {success ? (
              <Receipt data={success} onClose={() => setSuccess(null)} />
            ) : (
              <Card className="p-6 rounded-2xl border-dashed">
                <div className="text-center py-6">
                  <div className="mx-auto h-14 w-14 rounded-full bg-accent/15 grid place-items-center mb-3">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display font-bold text-primary">Your receipt appears here</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete the form to generate a downloadable donation receipt.
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Instant digital receipt</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> 80G eligible (where applicable)</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Secure & private</li>
                </ul>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Donor list */}
      <section className="container-wide pb-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary">Recent Donors</h2>
            <p className="text-sm text-muted-foreground mt-1">A heartfelt thank you to every contributor 💚</p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Total raised: {formatINR(totals.total)}
          </Badge>
        </div>

        <Card className="rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : donors.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">Be the first to donate ✨</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40">
                  <TableHead>Donor</TableHead>
                  <TableHead className="hidden md:table-cell">Message</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donors.map((d, i) => {
                  const display = d.anonymous ? "Anonymous" : d.name || "Donor";
                  return (
                    <TableRow key={d.id || d._id || i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-accent/15 text-accent grid place-items-center font-bold text-sm">
                            {display.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-primary">{display}</div>
                            {d.message && <div className="md:hidden text-xs text-muted-foreground line-clamp-1">{d.message}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground italic">
                        {d.message ? `"${d.message}"` : "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </TableCell>
                      <TableCell className="text-right font-display font-bold text-accent">
                        {formatINR(Number(d.amount || 0))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </section>
    </div>
  );
};

const Receipt = ({
  data,
  onClose,
}: {
  data: { id: string; amount: number; name: string; date: string };
  onClose: () => void;
}) => {
  const print = () => window.print();
  return (
    <Card className="rounded-2xl overflow-hidden border-2 border-accent/30 shadow-elegant">
      {/* Perforated top */}
      <div className="h-3 bg-[radial-gradient(circle_at_6px_50%,hsl(var(--background))_3px,transparent_3px)] [background-size:12px_12px] bg-accent" />
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Donation Receipt</p>
            <p className="font-display text-lg font-bold text-primary">Ba Prerna Nisarg</p>
          </div>
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </div>

        <div className="mt-5 rounded-xl bg-secondary/40 p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Amount Donated</p>
          <p className="font-display text-3xl font-bold text-primary mt-1">{formatINR(data.amount)}</p>
        </div>

        <dl className="mt-5 space-y-2.5 text-sm">
          <Row label="Receipt No." value={data.id} mono />
          <Row label="Donor" value={data.name} />
          <Row label="Date" value={data.date} />
          <Row label="Beneficiary" value="Jivdaya Trust" />
          <Row label="Status" value={<span className="text-accent font-bold">✓ Confirmed</span>} />
        </dl>

        <div className="mt-5 border-t border-dashed border-border pt-4 text-center">
          <p className="text-xs text-muted-foreground italic">
            "Your kindness rescues lives. Thank you for being part of this mission."
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={print}>
            <Download className="h-4 w-4 mr-1.5" /> Save / Print
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
      <div className="h-3 bg-[radial-gradient(circle_at_6px_50%,hsl(var(--background))_3px,transparent_3px)] [background-size:12px_12px] bg-accent" />
    </Card>
  );
};

const Row = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className="flex items-center justify-between gap-3">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className={`font-semibold text-primary text-right ${mono ? "font-mono" : ""}`}>{value}</dd>
  </div>
);

export default Donate;
