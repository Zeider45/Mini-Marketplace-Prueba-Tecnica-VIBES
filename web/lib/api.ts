import type {
  ProductsListResponse,
  ProductDetailResponse,
  TopCheapestResponse,
} from "./types";
import { PRODUCTS_API_URL } from "./const";
import { ProductsQuery } from "../../shared/types";

export async function getProducts(
  query?: ProductsQuery
): Promise<ProductsListResponse> {
  const queryParams = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
  }

  const res = await fetch(`${PRODUCTS_API_URL}?${queryParams.toString()}`);
  return res.json() as Promise<ProductsListResponse>;
}

export async function getProductById(
  id: string
): Promise<ProductDetailResponse> {
  const res = await fetch(`${PRODUCTS_API_URL}/${id}`);
  return res.json() as Promise<ProductDetailResponse>;
}

export async function getTopCheapest(top = 3): Promise<TopCheapestResponse> {
  const res = await fetch(`${PRODUCTS_API_URL}/top-cheap?top=${top}`);

  return res.json() as Promise<TopCheapestResponse>;
}
