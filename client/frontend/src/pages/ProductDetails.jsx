import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";
import { useCart } from "../context/CartContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, cartItems, totalItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [wishlistError, setWishlistError] = useState("");
  const cartQuantity =
    cartItems.find((item) => item.product?._id === product?._id)?.quantity ?? 0;

  const handleAddToCart = async () => {
    if (!product || addingToCart || cartQuantity >= product.stock) {
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      setCartError("");
      await addToCart(product._id);
      setCartMessage(
        cartQuantity
          ? `Quantity updated. ${cartQuantity + 1} now in your cart.`
          : `${product.name} added to cart.`
      );
    } catch (error) {
      setCartError(
        error.response?.data?.message ||
        "Unable to add product to cart. Please try again."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product || addingToWishlist || wishlistAdded) {
      return;
    }

    try {
      setAddingToWishlist(true);
      setWishlistMessage("");
      setWishlistError("");
      await axiosInstance.post(`/wishlist/${product._id}`);
      setWishlistAdded(true);
      setWishlistMessage(`${product.name} added to your wishlist.`);
    } catch (error) {
      if (error.response?.status === 409) {
        setWishlistAdded(true);
        setWishlistMessage(`${product.name} is already in your wishlist.`);
      } else {
        setWishlistError(
          error.response?.data?.message ||
          "Unable to add product to wishlist. Please try again."
        );
      }
    } finally {
      setAddingToWishlist(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);

        setProduct(response.data);
      } catch {
        setError("Something went wrong while loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs font-bold uppercase tracking-[1.5px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)]"
          >
            ← Back to products
          </Link>
        </div>

        <div className="grid gap-12 rounded-[32px] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_18px_60px_rgba(14,23,35,0.06)] md:grid-cols-2 md:p-8 lg:p-10">
          <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--butter)]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="eyebrow">{product.category}</p>

            <h1 className="mt-3 font-[var(--display)] text-5xl font-semibold">
              {product.name}
            </h1>

            <p className="mt-6 text-2xl">₹{product.price}</p>

            <p className="mt-6 leading-7 text-[var(--muted)]">
              {product.description}
            </p>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[1.4px] text-[var(--muted)]">
              {product.stock} units left
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                className="w-fit rounded-full border border-[var(--ink)] bg-[var(--ink)] px-8 py-4 text-sm font-bold uppercase tracking-[1.2px] text-white transition-colors hover:bg-[var(--coral)] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={addingToCart || cartQuantity >= product.stock}
              >
                {addingToCart
                  ? "Adding..."
                  : cartQuantity > 0
                  ? "Add Another"
                  : "Add to Cart"}
              </button>
              <button
                className="w-fit rounded-full border border-[var(--line)] px-6 py-4 text-sm font-bold uppercase tracking-[1.2px] text-[var(--ink)] transition-colors hover:border-[var(--coral)] hover:text-[var(--coral)] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleAddToWishlist}
                disabled={addingToWishlist || wishlistAdded}
              >
                {addingToWishlist
                  ? "Saving..."
                  : wishlistAdded
                  ? "♥ Added to Wishlist"
                  : "♡ Add to Wishlist"}
              </button>
            </div>

            {cartQuantity > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                <span>
                  In your cart:{" "}
                  <strong className="text-[var(--ink)]">{cartQuantity}</strong>
                </span>
                <Link
                  to="/cart"
                  className="font-bold text-[var(--coral)] underline underline-offset-4"
                >
                  View cart ({totalItems})
                </Link>
              </div>
            )}

            {cartMessage && (
              <p className="mt-3 text-sm text-green-700" role="status">
                {cartMessage}
              </p>
            )}
            {cartError && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {cartError}
              </p>
            )}
            {wishlistMessage && (
              <p className="mt-3 text-sm text-green-700" role="status">
                {wishlistMessage}
              </p>
            )}
            {wishlistError && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {wishlistError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
