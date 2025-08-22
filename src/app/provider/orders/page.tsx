"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addOrder, getOrders, updateOrderStatus, Order } from "@/lib/orders";

// --- helpers & constants ---
const STATUSES: Order["status"][] = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const categories = ["Food", "Electronics", "Home", "Accessories", "Clothing", "Books"];

function generateDummyOrders(n: number): Order[] {
  const arr: Order[] = [];
  for (let k = 0; k < n; k++) {
    const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, (_, i) => {
      const id = i + 1;
      const category = categories[Math.floor(Math.random() * categories.length)];
      const name = `${category} Item ${id}`;
      const price = parseFloat((Math.random() * 200 + 5).toFixed(2));
      const img = `https://placehold.co/80x80?text=${encodeURIComponent(category)}`;
      return { id, name, price, qty: 1 as const, img };
    });
    const subtotal = parseFloat(items.reduce((s, it) => s + it.price, 0).toFixed(2));
    const shipping = 9.99;
    const total = parseFloat((subtotal + shipping).toFixed(2));
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 28)).toISOString(); // last ~4 weeks
    const order: Order = {
      id: `PO-${Date.now()}-${k}-${Math.floor(Math.random() * 999)}`,
      createdAt,
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      customer: {
        fullName: `Customer ${k + 1}`,
        email: `customer${k + 1}@example.com`,
        phone: "(555) 010-0000",
        address1: "123 Market St",
        city: "Springfield",
        state: "CA",
        zip: "90210",
      },
      items,
      subtotal,
      shipping,
      total,
    };
    arr.push(order);
  }
  return arr;
}

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // search + filters
  const [query, setQuery] = useState(""); // order id / product name / customer name
  const [status, setStatus] = useState<"" | Order["status"]>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // selection for bulk actions
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<Order["status"]>("Processing");

  // bootstrap data + live updates
  useEffect(() => {
    const current = getOrders();
    if (current.length === 0) {
      const seed = generateDummyOrders(32);
      seed.forEach((o) => addOrder(o));
    } else {
      setOrders(current);
    }

    const refresh = () => setOrders([...getOrders()]);
    window.addEventListener("orders:updated", refresh);
    setTimeout(refresh, 0);

    return () => window.removeEventListener("orders:updated", refresh);
  }, []);

  // filtering & searching (memoized)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return orders.filter((o) => {
      const idMatch = o.id.toLowerCase().includes(q);
      const customerMatch = o.customer.fullName.toLowerCase().includes(q);
      const productMatch = o.items.some((it) => it.name.toLowerCase().includes(q));

      const statusMatch = status ? o.status === status : true;

      const created = new Date(o.createdAt);
      const fromOk = fromDate ? created >= new Date(fromDate) : true;
      const toOk = toDate ? created <= new Date(toDate + "T23:59:59") : true;

      const queryOk = q === "" ? true : idMatch || customerMatch || productMatch;

      return queryOk && statusMatch && fromOk && toOk;
    });
  }, [orders, query, status, fromDate, toDate]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // reset page & selection when filters change
  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [query, status, fromDate, toDate]);

  // selection helpers
  const isRowSelected = (id: string) => selected.has(id);
  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allOnPageSelected = pageSlice.length > 0 && pageSlice.every((o) => selected.has(o.id));
  const toggleSelectAll = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageSlice.forEach((o) => next.delete(o.id));
      } else {
        pageSlice.forEach((o) => next.add(o.id));
      }
      return next;
    });

  const applyBulkStatus = () => {
    if (selected.size === 0) return;
    // apply changes
    selected.forEach((id) => updateOrderStatus(id, bulkStatus));
    // clear selection after apply
    setSelected(new Set());
  };

  return (
    <div className="min-h-screen bg-textured p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Provider Portal — Orders</h1>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Search by Order ID, Product, or Customer"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="From"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="To"
        />
      </div>

      {/* Bulk actions bar */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="text-sm">
          Selected: <span className="font-semibold">{selected.size}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as Order["status"])}
            className="border rounded px-3 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={applyBulkStatus}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={selected.size === 0}
          >
            Apply to Selected
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all on page"
                  />
                </th>
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Items</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isRowSelected(o.id)}
                      onChange={() => toggleRow(o.id)}
                      aria-label={`Select order ${o.id}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <Link href={`/provider/orders/${o.id}`} className="underline hover:no-underline">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customer.fullName}</div>
                    <div className="text-xs text-gray-500">{o.customer.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {/* Items as text instead of images */}
                    <div className="text-gray-800">
                      {o.items.slice(0, 3).map((it, idx) => (
                        <span key={it.name}>
                          {it.name}
                          {idx < Math.min(2, o.items.length - 1) ? ", " : ""}
                        </span>
                      ))}
                      {o.items.length > 3 && (
                        <span className="text-gray-500"> +{o.items.length - 3} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        o.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : o.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : o.status === "Shipped"
                          ? "bg-purple-100 text-purple-800"
                          : o.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/provider/orders/${o.id}`}
                      className="text-black underline hover:no-underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {pageSlice.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-600">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
          <div>
            Showing{" "}
            <span className="font-medium">
              {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, filtered.length)}
            </span>{" "}
            of <span className="font-medium">{filtered.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
