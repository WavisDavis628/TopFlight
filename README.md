# Supplement Store Demo

This is a trial project implementing a **dual-interface web app** for a supplement store:  
- A **customer-facing storefront** (browse, filter, cart, checkout)  
- An **administrative provider portal** (orders, pagination, filters, status updates, details)

The app was built as part of an AI-assisted coding task with a ~2-hour timebox.  
It uses **Next.js + TypeScript + TailwindCSS + shadcn/ui**, with **dummy in-memory data** (no backend).

---

## 🚀 Features

### Storefront
- **Homepage**: Carousel of products + FAQ
- **All Products**: Grid with filters (category, price, bestseller), search, sorting
- **Product Details**: Dynamic route, product info, add-to-cart
- **Shopping Cart**: Add/remove items, clear, summary, proceed to checkout
- **Checkout**: Shipping form + order summary; generates an order in the Provider Portal

### Provider Portal
- **Orders Page**: Paginated table, search (order ID, product, customer), filters (date, status), bulk status update
- **Order Details**: Dynamic route, summary, customer info, product list, inline status change

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI**: TailwindCSS, shadcn/ui
- **State**: Local in-memory arrays + browser events (no persistence)
- **Styling**: Global Tailwind config + CSS variables

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version **18+**
- A package manager:
  - [pnpm](https://pnpm.io/) (recommended)  
  - or npm / yarn

Check your versions:
```bash
node -v
pnpm -v
```

## 📥 Clone the Repository
```bash
git clone <REPO_URL> supplement-store
cd supplement-store
```

### Install & Run
```bash
# install deps
pnpm install

# run dev server
pnpm dev
```

### open in browser
localhost:3000(http://localhost:3000)