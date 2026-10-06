import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [wishlistState, setWishlistState] = useState("idle");
  const [wishlistError, setWishlistError] = useState("");
  const [cartState, setCartState] = useState("idle");
  const [cartError, setCartError] = useState("");

  const handleAddToCart = async () => {
    if (cartState === "adding" || product.stock < 1) {
      return;
    }

    try {
      setCartState("adding");
      setCartError("");
      await addToCart(product._id);
      setCartState("added");
    } catch (error) {
      setCartState("idle");
      setCartError(
        error.response?.data?.message ||
        "Unable to add product to cart. Please try again."
      );
    }
  };

  const handleAddToWishlist = async () => {
    if (wishlistState === "saving" || wishlistState === "success") {
      return;
    }

    try {
      setWishlistState("saving");
      setWishlistError("");

      await axiosInstance.post(`/wishlist/${product._id}`);

      setWishlistState("success");
    } catch (error) {
      setWishlistState("error");
      setWishlistError(
        error.response?.data?.message ||
        "Unable to save product. Please try again."
      );
    }
  };

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--butter)]">
        <img
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
          src={product.image}
          alt={product.name}
        />

        <span className="absolute left-3 top-3 bg-[var(--paper)] px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px] text-[var(--ink)]">
          {product.category}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-4">
        <div>
          <h2 className="font-[var(--display)] text-lg font-semibold leading-tight text-[var(--ink)]">
            {product.name}
          </h2>

          <p className="mt-2 text-xs text-[var(--muted)]">
            {product.stock > 0
              ? `${product.stock} units available`
              : "Currently out of stock"}
          </p>
        </div>

        <strong className="whitespace-nowrap text-sm font-bold text-[var(--coral)]">
          ₹{product.price}
        </strong>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={() => navigate(`/products/${product._id}`)}>
          View Details
        </button>

        <button
          onClick={handleAddToCart}
          disabled={cartState === "adding" || product.stock < 1}
        >
          {cartState === "adding"
            ? "Adding..."
            : cartState === "added"
            ? "Add Another"
            : "Add to Cart"}
        </button>

        <button
          onClick={handleAddToWishlist}
          disabled={
            wishlistState === "saving" ||
            wishlistState === "success"
          }
        >
          {wishlistState === "saving"
            ? "⏳ Saving..."
            : wishlistState === "success"
            ? "♥ Added to Wishlist"
            : "♡ Add to Wishlist"}
        </button>
      </div>

      {cartError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {cartError}
        </p>
      )}

      {wishlistState === "error" && (
        <p className="mt-2 text-sm text-red-600">
          {wishlistError}
        </p>
      )}
    </article>
  );
};

export default ProductCard;