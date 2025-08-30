export interface Product {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  category: string;
  image: string;
}

export type ProductsQuery = {
  search?: string;
  sort?: "name" | "price";
  order?: "asc" | "desc";
  page?: string;
  limit?: string;
  available?: string;
};

export type Filters = {
  searchTerm: string;
  sort: "name" | "price";
  order: "asc" | "desc";
  available?: string;
  page: number;
};
