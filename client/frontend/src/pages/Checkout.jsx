import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";
import { useCart } from "../context/CartContext.jsx";

const initialForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

const validateForm = (form) => {
  const nextErrors = {};

  Object.entries(form).forEach(([key, value]) => {
    if (typeof value !== "string" || value.trim() === "") {
      nextErrors[key] = "This field is required.";
    }
  });

  if (form.fullName && form.fullName.trim().length < 2) {
    nextErrors.fullName = "Full name must contain at least 2 characters.";
  }

  if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
    nextErrors.phone = "Phone number must contain 10 digits.";
  }

  if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) {
    nextErrors.pincode = "Pincode must contain 6 digits.";
  }

  return nextErrors;
};

const Checkout = () => {
  const { cartItems, fetchCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [backendError, setBackendError] = useState("");

  const orderButtonLabel = useMemo(
    () => (submitting ? "Placing order..." : "Place Order"),
    [submitting]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setSubmitting(true);
      setBackendError("");

      const response = await axiosInstance.post("/orders/create-payment-order", {
        shippingAddress: form,
      });

      const { key, amount, currency, razorpayOrderId, shopKartOrderId } = response.data;

      const loadScript = () =>
        new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      const scriptLoaded = await loadScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded.");
      }

      const paymentObject = new window.Razorpay({
        key,
        amount,
        currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: razorpayOrderId,
        handler: async function (paymentResponse) {
          try {
            await axiosInstance.post("/orders/verify-payment", {
              shopKartOrderId,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });

            await fetchCart();
            navigate(`/order-success/${shopKartOrderId}`);
          } catch (error) {
            setBackendError(
              error.response?.data?.message || "Payment verification failed."
            );
          }
        },
        prefill: {
          name: form.fullName,
          contact: form.phone,
        },
        theme: {
          color: "#0f172a",
        },
      });

      paymentObject.on("payment.failed", function () {
        setBackendError("Payment failed. Your cart has not been cleared.");
      });

      paymentObject.open();
    } catch (error) {
      setBackendError(
        error.response?.data?.message || error.message || "Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-[var(--line)] bg-white p-8 text-center shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
          <h1 className="font-[var(--display)] text-4xl font-semibold">Checkout</h1>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Your cart is empty. Add products before checking out.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-flex min-h-[50px] items-center justify-center bg-[var(--ink)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--coral)]"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)]"
        >
          ← Back to cart
        </Link>

        <h1 className="mt-6 font-[var(--display)] text-5xl font-semibold tracking-[-2px]">
          Checkout
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <form onSubmit={handleSubmit} className="rounded-[28px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_60px_rgba(14,23,35,0.04)] sm:p-8">
            <h2 className="text-2xl font-semibold">Shipping Details</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none transition focus:border-[var(--ink)]"
                  placeholder="Aarav Sharma"
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none transition focus:border-[var(--ink)]"
                  placeholder="9876543210"
                />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Address</label>
                <input
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none transition focus:border-[var(--ink)]"
                  placeholder="22 MG Road"
                />
                {errors.addressLine1 && <p className="mt-2 text-sm text-red-600">{errors.addressLine1}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none transition focus:border-[var(--ink)]"
                  placeholder="Bengaluru"
                />
                {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none transition focus:border-[var(--ink)]"
                  placeholder="Karnataka"
                />
                {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--ink)]">Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none transition focus:border-[var(--ink)]"
                  placeholder="560001"
                />
                {errors.pincode && <p className="mt-2 text-sm text-red-600">{errors.pincode}</p>}
              </div>
            </div>

            {backendError && (
              <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {backendError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex min-h-[52px] items-center justify-center bg-[var(--ink)] px-6 text-sm font-bold uppercase tracking-[1.2px] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {orderButtonLabel}
            </button>
          </form>

          <aside className="rounded-[28px] border border-[var(--line)] bg-[var(--butter)] p-6 shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
            <h2 className="text-2xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between gap-4 text-sm">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[var(--line)] pt-5">
              <div className="flex items-center justify-between gap-4 text-base font-semibold">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {totalItems} item{totalItems === 1 ? "" : "s"}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
