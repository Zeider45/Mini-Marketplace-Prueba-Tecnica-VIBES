import type { Product } from "../../shared/types.js";

export type ProductsQuery = {
  search?: string;
  sort?: keyof Product;
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
  available?: string;
};