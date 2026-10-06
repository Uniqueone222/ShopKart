import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
    const {
        cartItems,
        loading,
        error,
        fetchCart,
        updateQuantity,
        removeFromCart,
        totalItems,
        subtotal,
    } = useCart();
    const [pendingProductId, setPendingProductId] = useState(null);
    const [actionError, setActionError] = useState("");

    const runCartAction = async (productId, action, fallbackMessage) => {
        setPendingProductId(productId);
        setActionError("");
        try {
            await action();
        } catch (error) {
            setActionError(
                error.response?.data?.message || fallbackMessage
            );
        } finally {
            setPendingProductId(null);
        }
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
                <div className="mx-auto max-w-7xl">
                    <p className="eyebrow">Your basket</p>
                    <h1 className="mt-3 font-[var(--display)] text-5xl font-semibold">
                        My Cart
                    </h1>
                    <div className="mt-10 rounded-[24px] border border-[var(--line)] bg-white p-8 text-sm text-[var(--muted)] shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
                        Loading your cart...
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
                <div className="mx-auto max-w-7xl">
                    <p className="eyebrow">Your basket</p>
                    <h1 className="mt-3 font-[var(--display)] text-5xl font-semibold">
                        My Cart
                    </h1>
                    <div className="mt-10 rounded-[24px] border border-[var(--line)] bg-white p-8 shadow-[0_18px_60px_rgba(14,23,35,0.04)]">
                        <h2 className="text-2xl font-semibold">
                            Unable to load your cart.
                        </h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                            Please try again in a moment.
                        </p>
                        <button
                            className="mt-6 rounded-full border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 text-xs font-bold uppercase tracking-[1.2px] text-white transition-colors hover:border-[var(--coral)] hover:bg-[var(--coral)]"
                            onClick={fetchCart}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
                        >
                            ← Continue shopping
                        </Link>
                    </div>
                    <div className="mb-12 border-b border-[var(--line)] pb-8">
                        <p className="eyebrow">Your basket</p>
                        <h1 className="mt-3 font-[var(--display)] text-5xl font-semibold tracking-[-2px] sm:text-6xl">
                            My Cart
                        </h1>
                    </div>
                    <div className="rounded-[28px] border border-[var(--line)] bg-[var(--butter)] px-6 py-16 text-center sm:px-10">
                        <span
                            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--paper)] text-3xl"
                            aria-hidden="true"
                        >
                            🛒
                        </span>
                        <h2 className="mt-6 text-3xl font-semibold tracking-[-1px]">
                            Your cart is empty
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
                            Looks like you haven't added anything yet. Find something
                            useful and lovely for your everyday.
                        </p>
                        <Link
                            to="/products"
                            className="mt-7 inline-flex min-h-[50px] items-center justify-center gap-4 bg-[var(--ink)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--coral)]"
                        >
                            Browse Products <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
                    >
                        ← Continue shopping
                    </Link>
                    <span className="text-xs font-bold uppercase tracking-[1.5px] text-[var(--muted)]">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                </div>

                <div className="mb-10 border-b border-[var(--line)] pb-8">
                    <p className="eyebrow">Your basket</p>
                    <h1 className="mt-3 font-[var(--display)] text-5xl font-semibold tracking-[-2px] sm:text-6xl">
                        My Cart
                    </h1>
                </div>

                {actionError && (
                    <p
                        role="alert"
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                        {actionError}
                    </p>
                )}

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-4">
                        {cartItems.map((item) => {
                            const product = item.product;
                            const isPending = pendingProductId === product._id;

                            return (
                                <article
                                    key={product._id}
                                    className="grid gap-5 rounded-[24px] border border-[var(--line)] bg-white p-4 shadow-[0_14px_40px_rgba(14,23,35,0.04)] sm:grid-cols-[144px_minmax(0,1fr)] sm:p-5"
                                >
                                    <Link
                                        to={`/products/${product._id}`}
                                        className="block aspect-square overflow-hidden rounded-[18px] bg-[var(--butter)]"
                                        aria-label={`View ${product.name}`}
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </Link>

                                    <div className="flex min-w-0 flex-col justify-between gap-5">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--coral)]">
                                                    {product.category}
                                                </p>
                                                <h2 className="mt-2 text-xl font-semibold tracking-[-0.5px]">
                                                    {product.name}
                                                </h2>
                                                <p className="mt-2 text-sm text-[var(--muted)]">
                                                    ₹{product.price} each
                                                </p>
                                            </div>
                                            <p className="font-[var(--display)] text-lg font-semibold text-[var(--ink)]">
                                                ₹{product.price * item.quantity}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
                                            <div className="inline-flex items-center rounded-full border border-[var(--line)]">
                                                <button
                                                    className="grid h-10 w-10 place-items-center rounded-l-full text-lg text-[var(--ink)] transition-colors hover:bg-[var(--butter)] disabled:cursor-not-allowed disabled:opacity-40"
                                                    onClick={() =>
                                                        runCartAction(
                                                            product._id,
                                                            () =>
                                                                updateQuantity(
                                                                    product._id,
                                                                    item.quantity - 1
                                                                ),
                                                            "Unable to update quantity."
                                                        )
                                                    }
                                                    disabled={item.quantity === 1 || isPending}
                                                    aria-label={`Decrease ${product.name} quantity`}
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-9 text-center text-sm font-bold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    className="grid h-10 w-10 place-items-center rounded-r-full text-lg text-[var(--ink)] transition-colors hover:bg-[var(--butter)] disabled:cursor-not-allowed disabled:opacity-40"
                                                    onClick={() =>
                                                        runCartAction(
                                                            product._id,
                                                            () =>
                                                                updateQuantity(
                                                                    product._id,
                                                                    item.quantity + 1
                                                                ),
                                                            "Unable to update quantity."
                                                        )
                                                    }
                                                    disabled={item.quantity >= product.stock || isPending}
                                                    aria-label={`Increase ${product.name} quantity`}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="text-xs font-bold uppercase tracking-[1.2px] text-[var(--muted)] underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-[var(--coral)] disabled:cursor-not-allowed disabled:opacity-40"
                                                onClick={() =>
                                                    runCartAction(
                                                        product._id,
                                                        () => removeFromCart(product._id),
                                                        "Unable to remove product."
                                                    )
                                                }
                                                disabled={isPending}
                                            >
                                                {isPending ? "Updating..." : "Remove"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <aside className="rounded-[24px] border border-[var(--line)] bg-[var(--butter)] p-6 sm:p-8 lg:sticky lg:top-8">
                        <p className="eyebrow">The details</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-1px]">
                            Order Summary
                        </h2>

                        <div className="mt-7 space-y-4 border-b border-[var(--line)] pb-6 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-[var(--muted)]">
                                    Items ({totalItems})
                                </span>
                                <span className="font-semibold text-[var(--ink)]">
                                    ₹{subtotal}
                                </span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-[var(--muted)]">Shipping</span>
                                <span className="font-semibold text-[var(--ink)]">
                                    Calculated at checkout
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4 py-6">
                            <span className="font-bold text-[var(--ink)]">Subtotal</span>
                            <span className="font-[var(--display)] text-xl font-semibold text-[var(--ink)]">
                                ₹{subtotal}
                            </span>
                        </div>

                        <button
                            className="flex min-h-[52px] w-full items-center justify-center gap-3 bg-[var(--ink)] px-5 text-sm font-bold text-white transition-colors hover:bg-[var(--coral)]"
                        >
                            Proceed to Checkout <span aria-hidden="true">→</span>
                        </button>
                        <p className="mt-4 text-center text-xs leading-5 text-[var(--muted)]">
                            Shipping and taxes are confirmed at checkout.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default Cart;
