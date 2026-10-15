import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";

const OrdersNavigation = () => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <Link
      to="/home"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
    >
      ← Back to home
    </Link>
    <Link
      to="/cart"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
    >
      Cart
    </Link>
  </div>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get("/orders");
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
        <div className="mx-auto max-w-5xl">
          <OrdersNavigation />
          <div className="rounded-[28px] border border-[var(--line)] bg-white p-10 text-sm text-[var(--muted)] shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
            Loading your orders...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-[var(--line)] bg-white p-10 shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
          <OrdersNavigation />
          <h1 className="font-[var(--display)] text-4xl font-semibold">My Orders</h1>
          <p className="mt-4 text-sm text-[var(--muted)]">{error}</p>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[var(--line)] bg-white p-10 text-center shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
          <OrdersNavigation />
          <h1 className="font-[var(--display)] text-4xl font-semibold">My Orders</h1>
          <p className="mt-5 text-base text-[var(--muted)]">You have not placed any orders yet.</p>
          <Link
            to="/products"
            className="mt-8 inline-flex min-h-[50px] items-center justify-center bg-[var(--ink)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--coral)]"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
      <div className="mx-auto max-w-5xl">
        <OrdersNavigation />
        <h1 className="font-[var(--display)] text-5xl font-semibold tracking-[-2px]">My Orders</h1>

        <div className="mt-8 space-y-5">
          {orders.map((order) => (
            <article key={order._id} className="rounded-[24px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[1.2px] text-[var(--muted)]">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[var(--ink)]">₹{order.totalAmount}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Status: {order.status}</p>
                </div>
              </div>

              <div className="mt-5">
                {order.items.map((item) => (
                  <p key={`${order._id}-${item.product}`} className="text-sm text-[var(--muted)]">
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex min-h-[46px] items-center justify-center border border-[var(--ink)] bg-[var(--ink)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--coral)]"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Orders;
