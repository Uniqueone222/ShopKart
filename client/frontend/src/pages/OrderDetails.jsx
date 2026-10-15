import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[var(--line)] bg-white p-10 text-sm text-[var(--muted)] shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
          Loading order details...
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[var(--line)] bg-white p-10 text-center shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
          <h1 className="font-[var(--display)] text-4xl font-semibold">Order Details</h1>
          <p className="mt-4 text-sm text-[var(--muted)]">{error || "Unable to load this order."}</p>
          <Link
            to="/orders"
            className="mt-8 inline-flex min-h-[50px] items-center justify-center bg-[var(--ink)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--coral)]"
          >
            Back to My Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-[var(--line)] bg-white p-8 shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[1.2px] text-[var(--muted)]">Order #{order._id.slice(-6)}</p>
            <h1 className="mt-2 font-[var(--display)] text-4xl font-semibold">Order Details</h1>
          </div>
          <Link
            to="/orders"
            className="inline-flex min-h-[46px] items-center justify-center border border-[var(--ink)] px-5 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
          >
            ← Back
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[20px] border border-[var(--line)] p-5">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <p className="mt-4 text-sm text-[var(--muted)]">Total: ₹{order.totalAmount}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Status: {order.status}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Payment: {order.paymentStatus}</p>
          </div>

          <div className="rounded-[20px] border border-[var(--line)] p-5">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <p className="mt-4 text-sm text-[var(--muted)]">{order.shippingAddress.fullName}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{order.shippingAddress.addressLine1}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{order.shippingAddress.pincode}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Items</h2>
          <div className="mt-4 space-y-4">
            {order.items.map((item) => (
              <div key={`${order._id}-${item.product}`} className="flex items-center justify-between gap-4 rounded-[18px] border border-[var(--line)] p-4">
                <div>
                  <p className="font-medium text-[var(--ink)]">{item.name}</p>
                  <p className="text-sm text-[var(--muted)]">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-[var(--ink)]">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
