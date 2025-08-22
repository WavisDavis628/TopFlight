"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

type Product = ReturnType<typeof generateProducts>[0];

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);

  // Load 5 random items on page load
  useEffect(() => {
    setCart(generateProducts(5));
  }, []);

  const removeItem = (id: number) => setCart((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-textured p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

      {cart.length === 0 ? (
        // ---- Fancy Empty State ----
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow p-10 flex flex-col items-center text-center">
            {/* Playful SVG */}
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              aria-hidden="true"
              className="mb-6"
            >
              <defs>
                <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d1d5db" />
                  <stop offset="100%" stopColor="#9ca3af" />
                </linearGradient>
              </defs>
              {/* Shadow */}
              <ellipse cx="110" cy="190" rx="70" ry="10" fill="#e5e7eb" />
              {/* Bag */}
              <rect x="50" y="60" width="120" height="110" rx="12" fill="url(#bagGrad)" />
              {/* Handles */}
              <path
                d="M80 60 C80 35, 140 35, 140 60"
                fill="none"
                stroke="#6b7280"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Smiley */}
              <circle cx="88" cy="110" r="6" fill="#111827" />
              <circle cx="132" cy="110" r="6" fill="#111827" />
              <path
                d="M90 135 C110 150, 130 150, 130 135"
                fill="none"
                stroke="#111827"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Ticket */}
              <rect x="140" y="40" width="36" height="22" rx="3" fill="#fbbf24" transform="rotate(12 158 51)" />
              <circle cx="148" cy="51" r="2" fill="#92400e" />
              <circle cx="168" cy="51" r="2" fill="#92400e" />
            </svg>

            <h2 className="text-2xl font-semibold">Your cart is feeling lonely</h2>
            <p className="text-gray-600 mt-2 max-w-md">
              Browse our products and add your favorites. We’ll keep them here while you shop.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-block px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        // ---- Cart With Items ----
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          {/* Cart Items */}
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <Image
                    unoptimized
                    src={item.img}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                    <p className="font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Cart Summary */}
          <div className="mt-6 border-t pt-4">
            <p className="text-lg">
              Items: <span className="font-bold">{cart.length}</span>
            </p>
            <p className="text-lg">
              Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
            onClick={() => {
                clearCart(); // your existing logic
                window.dispatchEvent(new Event("cart:clear")); // reset header badge
            }}
            className="flex-1 px-6 py-3 bg-gray-300 rounded hover:bg-gray-400"
            >
            Clear Cart
            </button>
            <Link
              href="/checkout"
              className="flex-1 text-center px-6 py-3 bg-black text-white rounded hover:bg-gray-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
