import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
const Home = () => {
  const { user, setUser } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products");
        if (active) {
          setProducts(response.data.products.slice(0, 4));
        }
      } catch (error) {
        if (active) {
          setProductsError(
            error.response?.data?.message ||
            "Unable to load products right now."
          );
        }
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await axiosInstance.get("/users/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="home-page bg-[var(--paper)]">
      <header className="site-header sticky top-0 z-20 h-[78px] border-b border-[var(--line)] bg-[var(--paper)]/95 px-5 backdrop-blur sm:px-10 lg:px-[76px]">
        <div className="home-header-left">
          <Link
            className="brand transition-colors hover:text-[var(--coral)]"
            to="/"
          >
            shop<span>kart</span>
          </Link>
          <nav
            className="main-nav home-main-nav hidden md:flex"
            aria-label="Main navigation"
          >
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/wishlist">Wishlist</NavLink>
          </nav>
        </div>
        <div className="header-actions home-header-actions flex items-center">
          <Link
            className="cart-link transition-colors hover:text-[var(--coral)]"
            to="/cart"
            aria-label="Shopping cart"
          >
            Cart <span>{totalItems}</span>
          </Link>
          {user ? (
            <div className="home-account-actions hidden items-center sm:flex">
              <Link
                className="home-profile-link transition-colors hover:text-[var(--coral)]"
                to="/profile"
              >
                {user.fullName}
              </Link>
              <button
                className="logout-button"
                type="button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              className="header-login hidden transition-colors hover:text-[var(--coral)] sm:block"
              to="/login"
            >
              Log in
            </Link>
          )}
        </div>
      </header>
      <div className="px-5 py-14 sm:px-10 lg:px-[7vw]">
        <section className="shop-intro flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Curated for you</p>
            <h1 className="text-5xl leading-[.92] sm:text-7xl">
              Small upgrades.
              <br />
              <em>Big difference.</em>
            </h1>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p>
              Thoughtful things for everyday living, selected with a soft spot for
              good design.
            </p>
            <Link
              className="rounded-full border border-[var(--line)] px-5 py-2 text-sm font-bold text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:bg-[var(--butter)]"
              to="/products"
            >
              View all products
            </Link>
          </div>
        </section>
        <section className="mt-12 lg:mt-[72px]" aria-labelledby="home-products-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
            <div>
              <p className="eyebrow">A place to start</p>
              <h2
                id="home-products-heading"
                className="mt-2 font-[var(--display)] text-3xl font-semibold tracking-[-1px] sm:text-4xl"
              >
                From the collection
              </h2>
            </div>
            <Link
              className="text-xs font-bold uppercase tracking-[1.2px] text-[var(--ink)] transition-colors hover:text-[var(--coral)]"
              to="/products"
            >
              Explore all products →
            </Link>
          </div>

          {productsLoading ? (
            <p className="py-10 text-center text-sm text-[var(--muted)]">
              Loading products...
            </p>
          ) : productsError ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6 text-center">
              <p className="text-sm text-[var(--muted)]">{productsError}</p>
              <Link
                className="mt-4 inline-block text-sm font-bold text-[var(--coral)] underline underline-offset-4"
                to="/products"
              >
                Browse the full catalog
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-[var(--line)] bg-white p-6 text-center">
              <p className="text-sm text-[var(--muted)]">
                No products are available right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
        <div className="shop-banner mt-16 flex flex-col gap-2 border-t border-[var(--line)] pt-4 sm:flex-row sm:justify-between">
          <span>Free shipping over $50</span>
          <Link to="/">Back to collection →</Link>
        </div>
      </div>
      <footer className="site-footer flex flex-wrap items-center gap-3 border-t border-[var(--line)] px-5 py-7 sm:gap-6 sm:px-10 lg:px-[76px]">
        <span>shopkart</span>
        <p>Good things, fairly priced.</p>
        <small>© 2026 ShopKart</small>
      </footer>
    </div>
  );
};

export default Home;
