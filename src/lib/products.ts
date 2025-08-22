// src/lib/products.ts

export type Product = {
  id: number;
  name: string;
  img: string;
  price: number;
  rating: number;
  desc: string;
  category: string;
  bestSeller: boolean;
};

// Categories must be defined BEFORE generateProducts uses them
const categories = ["Food", "Electronics", "Home", "Accessories", "Clothing", "Books"];

export function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = parseFloat((Math.random() * 200 + 5).toFixed(2));
    const rating = Math.floor(Math.random() * 5) + 1;
    const bestSeller = Math.random() < 0.3; // 30% chance
    const name = `${category} Item ${id}`;
    const desc = `This is a randomly generated ${category.toLowerCase()} product.`;

    // Dummy placeholder image (unique per id)
    const img = `https://placehold.co/400x400?text=Product+${id}`;

    return { id, name, img, price, rating, desc, category, bestSeller };
  });
}
