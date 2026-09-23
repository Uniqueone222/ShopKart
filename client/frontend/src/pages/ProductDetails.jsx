import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full object-cover"
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

          <p className="mt-6">{product.stock} units left</p>

          <button className="mt-8 w-fit border border-[var(--ink)] px-8 py-4">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
