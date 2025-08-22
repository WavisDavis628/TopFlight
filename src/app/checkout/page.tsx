"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { addOrder, Order } from "@/lib/orders";

// Dummy generator (same vibe as products)
const categories = ["Food", "Electronics", "Home", "Accessories", "Clothing", "Books"];
function generateItems(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = `${category} Item ${id}`;
    const price = parseFloat((Math.random() * 200 + 5).toFixed(2));
    const img = `https://placehold.co/200x200?text=Item+${id}`;
    return { id, name, price, qty: 1 as const, img };
  });
}

export default function CheckoutPage() {
  // Generate a fresh 5-item "order in progress" on mount
  const [items, setItems] = useState(generateItems(5));
  useEffect(() => {
    setItems(generateItems(5));
  }, []);

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const shipping = 9.99; // flat dummy shipping
  const total = useMemo(() => parseFloat((subtotal + shipping).toFixed(2)), [subtotal]);

  // Shipping form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [placing, setPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const isValid =
    fullName.trim() &&
    email.trim() &&
    phone.trim() &&
    address1.trim() &&
    city.trim() &&
    state.trim() &&
    zip.trim();

  const placeOrder = () => {
    if (!isValid) return;
    setPlacing(true);

    // create an order object
    const orderId = `PO-${Date.now()}`;
    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "Pending",
      customer: { fullName, email, phone, address1, address2, city, state, zip },
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total,
    };

    // store in memory for Provider Portal
    addOrder(order);

    // (Optional) clear cart badge since we're “checking out”
    window.dispatchEvent(new Event("cart:clear"));

    setPlacedOrderId(orderId);
    setPlacing(false);
  };

  if (placedOrderId) {
    // Confirmation state
    return (
      <div className="min-h-screen bg-textured p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold">Order placed 🎉</h1>
          <p className="text-gray-600 mt-2">
            Thanks, <span className="font-medium">{fullName}</span>! Your order
            <span className="font-mono"> {placedOrderId}</span> has been created.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              href="/provider/orders"
              className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 text-center"
            >
              View in Provider Portal
            </Link>
            <Link
              href={`/provider/orders/${placedOrderId}`}
              className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 text-center"
            >
              Go to Order Details
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-gray-300 rounded hover:bg-gray-400 text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-textured p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* Shipping Form */}
        <section className="lg:col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Full name *</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Jane Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="(555) 000-0000"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Address line 1 *</label>
              <input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="123 Market St"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Address line 2</label>
              <input
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Apt, suite, etc. (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Springfield"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State/Province *</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="CA"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ZIP/Postal Code *</label>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="90210"
                required
              />
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={!isValid || placing}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-60"
          >
            {placing ? "Placing order..." : "Place Order"}
          </button>
        </section>

        {/* Order Summary */}
        <aside className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Image
                    unoptimized
                    src={item.img}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                </div>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                // optional convenience: clear in-memory cart badge on summary
                window.dispatchEvent(new Event("cart:clear"));
                setItems([]); // visually empty summary if you want
              }}
              className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Clear Checkout (demo)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
