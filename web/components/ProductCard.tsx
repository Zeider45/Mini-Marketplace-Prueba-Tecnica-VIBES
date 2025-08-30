import { API_URL } from "@/lib/const";
import type { Product } from "../../shared/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="border rounded-lg p-4 shadow min-w-[250px] bg-white flex flex-col items-center">
    <img
      src={`${API_URL}${product.image}`}
      alt={product.name}
      className="w-[200px] h-[200px] object-cover rounded mb-3"
    />
    <div className="font-semibold text-[16px] mb-1 text-center">
      {product.name}
    </div>
    <div className="text-[14px] font-normal text-blue-600 mb-2">
      ${product.price}
    </div>
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        product.isAvailable
          ? "bg-green-500 text-white"
          : "bg-gray-500 text-white"
      }`}
    >
      {product.isAvailable ? "En stock" : "Sin stock"}
    </span>
  </div>
);
