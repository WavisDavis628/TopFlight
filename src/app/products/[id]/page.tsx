// app/products/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { generateProducts, Product } from "@/lib/products";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [added, setAdded] = useState(false); // prevent double increment

  useEffect(() => {
    const products = generateProducts(15);
    const found = products.find((p) => p.id.toString() === id);
    setProduct(found || null);
    setAdded(false); // reset when navigating to a different product
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    if (!added) {
      // increment header badge in-memory
      window.dispatchEvent(new Event("cart:increment"));
      setAdded(true);
    }
    // toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1400);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-textured">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-textured p-8 flex flex-col items-center">
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
        {/* Toast */}
        {showToast && (
          <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded shadow">
            Added to cart
          </div>
        )}

        <Image
          unoptimized
          src={product.img}
          alt={product.name}
          width={500}
          height={500}
          className="object-contain w-full h-80 mb-4 rounded"
        />
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.desc}</p>
        <p className="text-lg font-bold mt-3">${product.price.toFixed(2)}</p>
        <div className="flex mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < product.rating ? "text-yellow-500" : "text-gray-300"}>
              ★
            </span>
          ))}
        </div>

        <button
          onClick={addToCart}
          className="mt-6 px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-70"
          disabled={added}
        >
          {added ? "Already in Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
