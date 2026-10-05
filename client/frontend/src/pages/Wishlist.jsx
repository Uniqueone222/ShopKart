import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/wishlist");

      setWishlist(response.data.wishlist);
    } catch {
      setError("Something went wrong. We couldn't load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const pageNavigation = (
    <nav
      className="absolute left-5 right-5 top-6 flex items-center justify-between gap-3 sm:left-10 sm:right-10 lg:left-[7vw] lg:right-[7vw]"
      aria-label="Wishlist navigation"
    >
      <Link
        to="/home"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
      >
        ← Home
      </Link>
      <Link
        to="/products"
        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
      >
        Products →
      </Link>
    </nav>
  );

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);

      setWishlist((currentWishlist) =>
        currentWishlist.filter((product) => product._id !== productId)
      );
    } catch {
      setError("Unable to remove product from wishlist.");
    }
  };

  if (loading) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-[var(--paper)] px-5 text-[var(--ink)]">
        {pageNavigation}
        <p className="text-lg">Loading your wishlist...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--paper)] px-5 text-center text-[var(--ink)]">
        {pageNavigation}
        <div>
          <p className="text-2xl font-semibold">Something went wrong.</p>
          <p className="mt-2 text-[var(--muted)]">We couldn't load your wishlist.</p>
        </div>

        <button
          onClick={fetchWishlist}
          className="rounded-full border border-[var(--line)] px-5 py-2 transition-colors hover:bg-[var(--butter)]"
        >
          Try Again
        </button>
      </section>
    );
  }

  if (wishlist.length === 0) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--paper)] px-5 text-center text-[var(--ink)]">
        {pageNavigation}
        <div className="text-5xl">❤️</div>
        <div>
          <h1 className="text-3xl font-semibold">Your wishlist is empty</h1>
          <p className="mt-3 text-[var(--muted)]">
            Save products you love and find them here later.
          </p>
        </div>

        <Link
          to="/products"
          className="rounded-full border border-[var(--line)] px-5 py-2 transition-colors hover:bg-[var(--butter)]"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
          >
            ← Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
          >
            Products →
          </Link>
        </div>
        <div className="mb-12 border-b border-[var(--line)] pb-8">
          <p className="eyebrow">Your collection</p>

          <h1 className="mt-3 font-[var(--display)] text-5xl font-semibold">
            My Wishlist
          </h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product._id}>

              <img
                src={product.image}
                alt={product.name}
                className="w-full object-cover"
              />

              <p className="mt-4 text-sm uppercase tracking-wider text-[var(--muted)]">
                {product.category}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {product.name}
              </h2>

              <p className="mt-2">
                ₹{product.price}
              </p>

              <p className="mt-2 text-sm">
                {product.stock > 0
                  ? `${product.stock} units left`
                  : "Out of stock"}
              </p>

              <div className="mt-5 flex gap-3">
                <Link
                  to={`/products/${product._id}`}
                  className="border border-[var(--ink)] px-5 py-3"
                >
                  View Details
                </Link>

                <button
                  onClick={() => handleRemove(product._id)}
                  className="border border-[var(--ink)] px-5 py-3"
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Wishlist;