import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios.js";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

            <button className="mt-8 w-fit rounded-full border border-[var(--ink)] bg-[var(--ink)] px-8 py-4 text-sm font-bold uppercase tracking-[1.2px] text-white transition-colors hover:bg-[var(--coral)]">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
