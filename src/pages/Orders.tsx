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
    return Array.isArray(data) ? data : data?.orders || [];
  } catch {
    return [];
  }
};

const Orders = () => {
  const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Your Orders</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-card rounded-2xl border border-border animate-pulse" />
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
        <div className="space-y-4">
          {orders.map((o: any) => {
            const items = o.items || o.products || [];
            const total = o.total || o.totalAmount || o.amount || 0;
            const status = o.status || o.orderStatus || "Placed";
            const id = o.id || o.orderId || o._id || "";
            const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "";
            return (
              <div key={String(id)} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Order #{id}</p>
                    <p className="font-display text-lg font-bold mt-1">{formatINR(Number(total))}</p>
                    {date && <p className="text-xs text-muted-foreground mt-0.5">Placed on {date}</p>}
                  </div>
                  <span className="bg-leaf text-leaf-foreground text-xs font-semibold uppercase px-3 py-1 rounded-full">
                    {status}
                  </span>
                </div>
                {items.length > 0 && (
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm">
                    {items.slice(0, 4).map((it: any, i: number) => (
                      <li key={i} className="flex justify-between gap-2 text-muted-foreground">
                        <span className="line-clamp-1">{it.name || it.productName || it.product?.name || "Item"}</span>
                        <span>× {it.quantity || 1}</span>
                      </li>
                    ))}
                    {items.length > 4 && <li className="text-xs text-muted-foreground">+ {items.length - 4} more</li>}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
