import type { Product } from "./types";

export function getTopCheapestAvailable(
  products: Product[],
  top: number = 3
): Product[] {
  return products
    .filter((product) => product.isAvailable)
    .sort((a, b) => a.price - b.price)
    .slice(0, top);
}
