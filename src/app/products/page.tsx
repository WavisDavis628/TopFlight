"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

// Categories to choose from
const categories = ["Food", "Electronics", "Home", "Accessories", "Clothing", "Books"];

// Generate random products
function generateProducts(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = parseFloat((Math.random() * 200 + 5).toFixed(2));
    const rating = Math.floor(Math.random() * 5) + 1;
    const bestSeller = Math.random() < 0.3;
    const name = `${category} Item ${id}`;
    const desc = `This is a randomly generated ${category.toLowerCase()} product.`;
    const img = `https://placehold.co/400x400?text=Product+${id}`;
    return { id, name, img, price, rating, desc, category, bestSeller };
  });
}

export default function ProductsPage() {
  // Products live in state (fixed after first load)
  const [products, setProducts] = useState<
    { id: number; name: string; img: string; price: number; rating: number; desc: string; category: string; bestSeller: boolean; }[]
  >([]);
  useEffect(() => { setProducts(generateProducts(15)); }, []);

  // Per-item added/ toast state
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [toastIds, setToastIds] = useState<Set<number>>(new Set());
  const showToastFor = (id: number) => {
    setToastIds(prev => new Set(prev).add(id));
    setTimeout(() => setToastIds(prev => { const s = new Set(prev); s.delete(id); return s; }), 1200);
  };
  const addToCart = (id: number) => {
    if (!addedIds.has(id)) {
      window.dispatchEvent(new Event("cart:increment")); // in-memory badge
      setAddedIds(prev => new Set(prev).add(id));
    }
    showToastFor(id);
  };

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const q = search.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
        const matchesCategory = category === "All" || p.category === category;
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
        const matchesBestSeller = !bestSellerOnly || p.bestSeller;
        return matchesSearch && matchesCategory && matchesPrice && matchesBestSeller;
      })
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "alpha") return a.name.localeCompare(b.name);
        if (sort === "bestseller") return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        return 0;
      });
  }, [products, search, category, priceRange, bestSellerOnly, sort]);

  return (
    <div className="min-h-screen bg-textured p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-3 py-2 w-full">
          <option value="All">All Categories</option>
          {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <select
          value={priceRange.toString()}
          onChange={(e) => {
            const [min, max] = e.target.value.split(",").map(Number);
            setPriceRange([min, max]);
          }}
          className="border rounded px-3 py-2 w-full"
        >
          <option value={[0, 200].toString()}>All Prices</option>
          <option value={[0, 25].toString()}>Under $25</option>
          <option value={[25, 100].toString()}>$25 - $100</option>
          <option value={[100, 200].toString()}>$100 - $200</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-3 py-2 w-full">
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="alpha">Alphabetical</option>
          <option value="bestseller">Best Sellers First</option>
        </select>
        <label className="flex items-center gap-2 text-sm col-span-full">
          <input type="checkbox" checked={bestSellerOnly} onChange={(e) => setBestSellerOnly(e.target.checked)} />
          Show only Best Sellers
        </label>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="relative bg-white rounded-lg shadow p-4 flex flex-col items-center text-center group hover:shadow-lg transition">
            {/* toast */}
            {toastIds.has(p.id) && (
              <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded shadow">Added to cart</div>
            )}

            <Link href={`/products/${p.id}`} className="w-full">
              <Image
                unoptimized
                src={p.img}
                alt={p.name}
                width={300}
                height={300}
                className="object-cover h-48 w-full mb-3 rounded"
              />
            </Link>

            <Link href={`/products/${p.id}`} className="group-hover:underline">
              <h3 className="text-lg font-semibold">{p.name}</h3>
            </Link>

            <p className="text-gray-600 text-sm mt-1">{p.desc}</p>
            <p className="text-lg font-bold mt-2">${p.price.toFixed(2)}</p>
            <div className="flex justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < p.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
              ))}
            </div>

            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(p.id); }}
              className="mt-4 w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-70"
              disabled={addedIds.has(p.id)}
            >
              {addedIds.has(p.id) ? "Already in Cart" : "Add to Cart"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-600">No products found.</p>
        )}
      </div>
    </div>
  );
}
