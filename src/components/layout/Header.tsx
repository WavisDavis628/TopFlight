// components/layout/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // always starts at 0

  useEffect(() => {
    const onIncrement = () => setCartCount((c) => c + 1);
    const onDecrement = () => setCartCount((c) => Math.max(0, c - 1));
    const onClear = () => setCartCount(0);

    window.addEventListener("cart:increment", onIncrement);
    window.addEventListener("cart:decrement", onDecrement);
    window.addEventListener("cart:clear", onClear);

    return () => {
      window.removeEventListener("cart:increment", onIncrement);
      window.removeEventListener("cart:decrement", onDecrement);
      window.removeEventListener("cart:clear", onClear);
    };
  }, []);

  return (
    // fixed header
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">Top Flight Test App</Link>

        {/* Desktop Nav + Cart */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-gray-600">Home</Link>
            <Link href="/products" className="hover:text-gray-600">Products</Link>
            <Link href="/cart" className="hover:text-gray-600">Cart</Link>
            <Link href="/checkout" className="hover:text-gray-600">Checkout</Link>
            <Link href="/provider/orders" className="hover:text-gray-600">Provider Portal</Link>
          </nav>

          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-black" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Cart + Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="flex flex-col justify-center items-center w-8 h-8 relative"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={`absolute h-0.5 w-6 bg-black transform transition duration-300 ${isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"}`} />
            <span className={`absolute h-0.5 w-6 bg-black transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute h-0.5 w-6 bg-black transform transition duration-300 ${isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu (animated) */}
      <div className={`md:hidden overflow-hidden border-t transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setIsOpen(false)}>Products</Link>
          <Link href="/cart" onClick={() => setIsOpen(false)}>Cart</Link>
          <Link href="/checkout" onClick={() => setIsOpen(false)}>Checkout</Link>
          <Link href="/provider/orders" onClick={() => setIsOpen(false)}>Provider Portal</Link>
        </nav>
      </div>
    </header>
  );
}
