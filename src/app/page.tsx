"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Product = {
  id: number; name: string; img: string; price: number; rating: number; desc: string; category: string; bestSeller: boolean;
};
const categories = ["Food", "Electronics", "Home", "Accessories", "Clothing", "Books"];
const generateProducts = (count: number): Product[] =>
  Array.from({ length: count }, (_, i) => {
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

const faqs = [
  { q: "What payment methods do you accept?", a: "Credit card, PayPal, and gift cards." },
  { q: "How fast is shipping?", a: "Most orders arrive within 3–5 business days." },
  { q: "Can I return a product?", a: "Yes, returns accepted within 30 days." },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [toastIds, setToastIds] = useState<Set<number>>(new Set());

  useEffect(() => { setProducts(generateProducts(15)); }, []);

  const showToastFor = (id: number) => {
    setToastIds(prev => new Set(prev).add(id));
    setTimeout(() => setToastIds(prev => { const s = new Set(prev); s.delete(id); return s; }), 1200);
  };
  const addToCart = (id: number) => {
    if (!addedIds.has(id)) {
      window.dispatchEvent(new Event("cart:increment"));
      setAddedIds(prev => new Set(prev).add(id));
    }
    showToastFor(id);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-textured">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Carousel Section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-textured p-6">
        <h2 className="text-3xl font-bold mb-9">Top Flight Test App</h2>
        <Carousel className="w-full max-w-3xl">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="flex justify-center">
                <div className="relative w-full max-w-md bg-white rounded-xl p-6 flex flex-col items-center text-center shadow">
                  {/* toast */}
                  {toastIds.has(product.id) && (
                    <div className="absolute top-3 right-3 bg-black text-white text-xs px-3 py-1 rounded shadow">
                      Added to cart
                    </div>
                  )}

                  <Image
                    src={product.img}
                    alt={product.name}
                    width={400}
                    height={400}
                    unoptimized
                    className="object-contain h-64 w-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-600 mt-2">{product.desc}</p>
                  <p className="text-lg font-bold mt-3">${product.price.toFixed(2)}</p>
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < product.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                    ))}
                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="mt-4 w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-70"
                    disabled={addedIds.has(product.id)}
                  >
                    {addedIds.has(product.id) ? "Already in Cart" : "Add to Cart"}
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <details key={idx} className="rounded border p-4 bg-white shadow-sm">
              <summary className="cursor-pointer font-medium">{faq.q}</summary>
              <p className="mt-2 text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
