import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { api, unwrap } from "@/lib/api";
import { formatINR } from "@/lib/product";
import { Button } from "@/components/ui/button";

const fetchOrders = async (): Promise<any[]> => {
  try {
    const res = await api.get("/api/checkout/orders");
    const data = unwrap<any>(res);
    // The response has { orders: [...], pagination: ... }
    return data?.orders || [];
  } catch {
    return [];
  }
};

const Orders = () => {
  const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered") return "bg-green-100 text-green-700 border-green-200";
    if (s === "shipped") return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "confirmed" || s === "placed") return "bg-leaf/10 text-leaf border-leaf/20";
    if (s === "cancelled") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Your Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-card rounded-2xl border border-border animate-pulse" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <Package className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold">No orders yet</h2>
          <p className="text-muted-foreground mt-2">Place your first order — we promise it'll feel good.</p>
          <Button asChild variant="hero" className="mt-6"><Link to="/products">Start shopping</Link></Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o: any) => {
            const items = o.orderItems || o.items || o.products || [];
            const total = o.totalAmount || o.total || o.amount || 0;
            const status = o.status || "Placed";
            const id = o.orderNumber || o.id || "";
            const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "";
            
            return (
              <div key={String(o.id)} className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
                {/* Order Header */}
                <div className="bg-muted/30 p-4 md:px-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-4 md:gap-8 flex-wrap">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Order Placed</p>
                      <p className="text-sm font-medium mt-0.5">{date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total</p>
                      <p className="text-sm font-bold mt-0.5">{formatINR(Number(total))}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Order #</p>
                      <p className="text-sm font-medium mt-0.5">{id}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="p-4 md:p-6 space-y-4">
                  {items.map((it: any, i: number) => (
                    <div key={i} className="flex gap-4 md:gap-6">
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                        <img 
                          src={it.productImage || it.variantImage || it.product?.featured_image || "/placeholder.svg"} 
                          alt={it.productName || "Product"} 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                              {it.productName || it.product?.name || "Organic Product"}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {it.variantLabel && (
                                <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md font-medium">
                                  {it.variantLabel}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">Qty: {it.quantity}</span>
                            </div>
                          </div>
                          <p className="font-bold text-sm md:text-base whitespace-nowrap">
                            {formatINR(Number(it.price || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
