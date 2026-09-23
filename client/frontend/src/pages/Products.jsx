import { useEffect, useState } from "react";
import axiosInstance from "../axiosCalls/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products", {
          params: {
            search,
            category,
          },
        });
        setProducts(response.data.products);
      } catch {
        setError("Something went wrong while loading products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
  {
    products.length === 0 ? (
      <p>No products found.</p>
    ) : (
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  }
  return (
    <section className="min-h-screen bg-[var(--paper)] px-5 py-12 text-[var(--ink)] sm:px-10 lg:px-[7vw] lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-[var(--line)] pb-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">The collection</p>
            <h1 className="mt-3 font-[var(--display)] text-5xl font-semibold leading-none tracking-[-2px] sm:text-7xl">
              Find your <em>next</em> thing.
            </h1>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[var(--muted)]">
            Useful, beautiful pieces chosen for the everyday rituals that make a
            home feel like yours.
          </p>
        </div>
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />
        <div className="mb-8 flex items-center justify-between text-xs font-bold uppercase tracking-[1.5px] text-[var(--muted)]">
          <span>{products.length} products</span>
          <span className="hidden sm:block">Shop the edit</span>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
