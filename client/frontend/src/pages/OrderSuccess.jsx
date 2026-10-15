import { Link, useParams } from "react-router-dom";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-[var(--line)] bg-white p-10 text-center shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">✓</div>
        <h1 className="mt-6 font-[var(--display)] text-4xl font-semibold">Order Placed Successfully</h1>
        <p className="mt-4 text-sm text-[var(--muted)]">Order ID: {id}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">Your order has been saved successfully.</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/orders"
            className="inline-flex min-h-[50px] items-center justify-center bg-[var(--ink)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--coral)]"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="inline-flex min-h-[50px] items-center justify-center border border-[var(--ink)] px-6 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;
