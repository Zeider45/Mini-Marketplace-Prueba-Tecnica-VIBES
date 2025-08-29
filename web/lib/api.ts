import type { Product } from "../../shared/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchTopCheapest(top: number = 3): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products/top-cheap?top=${top}`);
  if (!res.ok) throw new Error("Error fetching top cheapest");
  return res.json();
}
