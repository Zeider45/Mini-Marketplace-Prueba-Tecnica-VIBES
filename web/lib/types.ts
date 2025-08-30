import { Product } from "../../shared/types";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: string | null;
};

export type ProductsListResponse = ApiResponse<{
  total: number;
  products: Product[];
}>;

export type ProductDetailResponse = ApiResponse<Product | null>;

export type TopCheapestResponse = ApiResponse<Product[]>;
