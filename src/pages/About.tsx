import { Leaf, Sprout, Users, HeartHandshake, ShieldCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <>
      <section className="bg-hero text-primary-foreground">
        <div className="container-wide py-16 md:py-24">
          <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.18em]">
            <Leaf className="h-3.5 w-3.5 text-accent" /> Our Story
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-5 max-w-3xl leading-tight">
            Rooted in tradition. Growing for tomorrow.
          </h1>
          <p className="mt-5 text-base md:text-lg max-w-2xl opacity-90 leading-relaxed">
            Organic Nisarg is a mission-driven brand bringing 100% organic fertilizers and farm produce
            from trusted Indian farmers, helping families and growers return to nature — without compromise.
          </p>
        </div>
      </section>

      <section className="container-wide py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">Why we exist</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            India's soil has fed civilizations for thousands of years. Today, chemical-heavy farming is
            depleting that legacy. We partner with smallholder farms to produce certified organic
            fertilizers and food — restoring soil health, farmer livelihoods, and family wellbeing.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Every order you place supports regenerative agriculture and contributes to our partner
            <strong className="text-foreground"> Jivdaya Trust </strong> — caring for animals and the
            ecosystems they sustain.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/products">Explore products</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, n: "500+", l: "Happy Customers" },
            { icon: Sprout, n: "100%", l: "Organic Certified" },
            { icon: ShieldCheck, n: "50+", l: "Partner Farms" },
            { icon: Award, n: "10 Yrs", l: "Of Experience" },
          ].map(({ icon: Icon, n, l }) => (
            <div key={l} className="p-6 rounded-2xl bg-card border border-border shadow-soft">
              <Icon className="h-8 w-8 text-primary" />
              <div className="font-display text-3xl font-bold mt-3">{n}</div>
              <div className="text-sm text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary border-y border-border">
        <div className="container-wide py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center">Our values</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: Leaf, t: "Pure & Natural", d: "No chemicals, no shortcuts. What grows in nature, stays in nature." },
              { icon: HeartHandshake, t: "Farmer First", d: "Fair pricing and direct partnerships with small Indian farms." },
              { icon: Sprout, t: "Regenerative", d: "We invest in soil health for the next generation of growers." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="p-8 rounded-2xl bg-card">
                <span className="grid place-items-center h-12 w-12 rounded-full bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-bold mt-4">{t}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
