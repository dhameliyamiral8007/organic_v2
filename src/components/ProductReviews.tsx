import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Send, MessageSquare, X } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Review {
  id?: string | number;
  rating: number;
  comment: string;
  userName?: string;
  user?: { name?: string };
  createdAt?: string;
}

const fetchReviews = async (productId: string): Promise<Review[]> => {
  try {
    return unwrap<Review[]>(await api.get(`/api/reviews/product/${productId}`));
  } catch {
    return [];
  }
};

export const ProductReviews = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviews(productId),
    enabled: !!productId,
  });

  const submit = useMutation({
    mutationFn: async () => {
      await api.post("/api/reviews", { productId, rating, comment });
    },
    onSuccess: () => {
      toast.success("Review submitted! Thank you.");
      setShowForm(false);
      setComment("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (e: any) => toast.error(e.message || "Could not submit review"),
  });

  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / total : 0;
  const breakdown = [5, 4, 3, 2, 1].map((s) => {
    const count = reviews.filter((r) => Math.round(Number(r.rating)) === s).length;
    return { star: s, count, pct: total ? (count / total) * 100 : 0 };
  });

  return (
    <section className="mt-16">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Customer Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-display text-3xl font-bold">{avg ? avg.toFixed(1) : "0"}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-5 w-5", i < Math.round(avg) ? "fill-accent text-accent" : "text-muted-foreground/30")} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Based on {total} review{total === 1 ? "" : "s"}</span>
          </div>
        </div>
        {user ? (
          <Button variant={showForm ? "outline" : "hero"} className="rounded-full" onClick={() => setShowForm((s) => !s)}>
            {showForm ? <><X className="h-4 w-4 mr-1" /> Cancel</> : <>Write a Review</>}
          </Button>
        ) : (
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/auth">Sign in to review</Link>
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && user && (
        <div className="bg-secondary/40 border border-border rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Write your review</h3>
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const v = i + 1;
                return (
                  <button
                    key={v}
                    type="button"
                    onMouseEnter={() => setHover(v)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(v)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={cn("h-7 w-7", v <= (hover || rating) ? "fill-accent text-accent" : "text-muted-foreground/30")} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium block mb-2">Your Review</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={5}
              className="bg-background"
            />
          </div>
          <div className="flex justify-end">
            <Button
              variant="hero"
              disabled={!comment.trim() || submit.isPending}
              onClick={() => submit.mutate()}
            >
              <Send className="h-4 w-4 mr-1" />
              {submit.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      )}

      {/* Breakdown + reviews list */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 h-fit">
          <h3 className="font-semibold mb-4">Rating Breakdown</h3>
          <div className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-accent font-semibold">{b.star}</span>
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">{Math.round(b.pct)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {reviews.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r, i) => (
                <li key={r.id || i} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                        {(r.userName || r.user?.name || "A").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{r.userName || r.user?.name || "Anonymous"}</div>
                        {r.createdAt && (
                          <div className="text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={cn("h-4 w-4", j < (r.rating || 0) ? "fill-accent text-accent" : "text-muted-foreground/30")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{r.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
