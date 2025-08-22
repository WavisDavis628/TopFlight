// src/lib/orders.ts
export type OrderItem = {
  id: number;
  name: string;
  price: number;
  qty: 1;           // single-qty per your rules
  img: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

// session-only (no refresh persistence)
type OrdersMem = { orders: Order[] };
const ORDERS_KEY = "__ORDERS_MEM__";

function getMem(): OrdersMem {
  if (!(ORDERS_KEY in globalThis)) {
    // @ts-ignore
    globalThis[ORDERS_KEY] = { orders: [] as Order[] };
  }
  // @ts-ignore
  return globalThis[ORDERS_KEY] as OrdersMem;
}

export function addOrder(order: Order) {
  const mem = getMem();
  mem.orders.unshift(order);
  // notify listeners (Provider Portal can listen)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("orders:updated", { detail: mem.orders.length }));
  }
}

export function getOrders(): Order[] {
  return getMem().orders;
}

export function getOrderById(id: string): Order | undefined {
  return getMem().orders.find((o) => o.id === id);
}

export function updateOrderStatus(id: string, status: Order["status"]) {
  const o = getOrderById(id);
  if (o) o.status = status;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("orders:updated"));
  }
}
