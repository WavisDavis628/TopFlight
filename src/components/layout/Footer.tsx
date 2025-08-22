"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-gray-600">
        <div>
          <h4 className="font-semibold mb-2">About Us</h4>
          <p className="text-gray-500">
            BrandStore is a demo storefront. All products are dummy data.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Links</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/products" className="hover:underline">
                Browse Products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                View Cart
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:underline">
                Checkout
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <p>Email: support@brandstore.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
      </div>
      <div className="border-t text-center text-xs py-4 text-gray-500">
        © {new Date().getFullYear()} BrandStore. All rights reserved.
      </div>
    </footer>
  );
}
