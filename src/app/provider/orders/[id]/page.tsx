"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrderById, updateOrderStatus, Order } from "@/lib/orders";

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<Order["status"] | "">("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Load the order by id
  useEffect(() => {
    const o = id ? getOrderById(id) : undefined;
    setOrder(o ?? null);
    setStatus(o?.status ?? "");
  }, [id]);

  // Keep status in sync if external updates happen
  useEffect(() => {
    const refresh = () => {
      const o = id ? getOrderById(id) : undefined;
      if (o) {
        setOrder({ ...o });
        setStatus(o.status);
      }
    };
    window.addEventListener("orders:updated", refresh);
    return () => window.removeEventListener("orders:updated", refresh);
  }, [id]);

  const lineItems = useMemo(() => {
    return (order?.items ?? []).map((it) => ({
      ...it,
      lineTotal: it.price * it.qty,
    }));
  }, [order]);

  const handleStatusSave = async () => {
    if (!order || !status || status === order.status) return;
    setSaving(true);
    updateOrderStatus(order.id, status as Order["status"]);
    setSaving(false);
    setToast("Status updated");
    setTimeout(() => setToast(null), 1200);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-textured p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-2xl font-bold mb-2">Order not found</h1>
          <p className="text-gray-600">We couldn’t find an order with id: <span className="font-mono">{id}</span></p>
          <div className="mt-6">
            <Link href="/provider/orders" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-textured p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header & actions */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Order {order.id}</h1>
            <p className="text-gray-600">
              Placed on{" "}
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Order["status"])}
              className="border rounded px-3 py-2 bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusSave}
              disabled={saving || status === order.status}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Status"}
            </button>
            <Link
              href="/provider/orders"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Back to Orders
            </Link>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="mb-4">
            <div className="inline-block bg-black text-white text-xs px-3 py-1 rounded shadow">
              {toast}
            </div>
          </div>
        )}

        {/* Layout: Summary / Customer / Items */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Summary */}
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Items</dt>
                <dd className="font-medium">{order.items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium">${order.subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium">${order.shipping.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 text-base">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold">${order.total.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between mt-2">
                <dt className="text-gray-600">Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Order ID</dt>
                <dd className="font-mono">{order.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Placed</dt>
                <dd>{new Date(order.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </section>

          {/* Customer Details */}
          <section className="bg-white rounded-xl shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Name</div>
                <div className="font-medium">{order.customer.fullName}</div>
              </div>
              <div>
                <div className="text-gray-600">Email</div>
                <div className="font-medium">{order.customer.email}</div>
              </div>
              <div>
                <div className="text-gray-600">Phone</div>
                <div className="font-medium">{order.customer.phone}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-gray-600">Address</div>
                <div className="font-medium">
                  {order.customer.address1}
                  {order.customer.address2 ? `, ${order.customer.address2}` : ""}
                  , {order.customer.city}, {order.customer.state} {order.customer.zip}
                </div>
              </div>
            </div>
          </section>

          {/* Product List */}
          <section className="bg-white rounded-xl shadow p-6 lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-2">Product</th>
                    <th className="text-right px-4 py-2">Price</th>
                    <th className="text-right px-4 py-2">Qty</th>
                    <th className="text-right px-4 py-2">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((it) => (
                    <tr key={`${it.id}-${it.name}`} className="border-t">
                      <td className="px-4 py-2">{it.name}</td>
                      <td className="px-4 py-2 text-right">${it.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">{it.qty}</td>
                      <td className="px-4 py-2 text-right">${it.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td className="px-4 py-2 text-right font-semibold" colSpan={3}>
                      Subtotal
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ${order.subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-right font-semibold" colSpan={3}>
                      Shipping
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">
                      ${order.shipping.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-right font-bold text-base" colSpan={3}>
                      Total
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-base">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
