import { MapPin, Mail, Phone, ExternalLink, Navigation } from "lucide-react";
import { OFFICES } from "@/lib/offices";

export const OfficesGrid = () => (
  <section className="container-wide py-16">
    <div className="text-center mb-10">
      <span className="inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] rounded-full bg-accent/15 text-accent font-semibold">
        Our Network
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">Offices & Sites</h2>
      <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
        Visit any of our processing units or head office across India.
      </p>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {OFFICES.map((o) => (
        <article
          key={o.name}
          className="group relative p-6 rounded-2xl border border-border bg-card hover:shadow-elegant transition-smooth"
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground shrink-0">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold leading-snug">{o.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{o.city}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm border-t border-border pt-3 mt-3">
            <div className="flex items-start gap-2 text-muted-foreground">
              <Navigation className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
              <span className="font-mono text-xs">{o.coords}</span>
            </div>
            <a href={`mailto:${o.email}`} className="flex items-center gap-2 hover:text-accent transition-smooth">
              <Mail className="h-4 w-4 text-accent" /> {o.email}
            </a>
            <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-accent transition-smooth">
              <Phone className="h-4 w-4 text-accent" /> {o.phone}
            </a>
          </div>

          <a
            href={o.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-smooth"
          >
            Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </article>
      ))}
    </div>
  </section>
);

export default OfficesGrid;
