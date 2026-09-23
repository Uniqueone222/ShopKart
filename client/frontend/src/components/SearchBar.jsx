const SearchBar = ({ search, setSearch, category, setCategory }) => {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-[var(--line)] bg-transparent px-4 py-3 outline-none sm:flex-1"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-[var(--line)] bg-[var(--paper)] px-4 py-3 outline-none"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="fashion">Fashion</option>
        <option value="books">Books</option>
        <option value="home">Home</option>
      </select>
    </div>
  );
};

export default SearchBar;