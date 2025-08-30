"use client";

import React, { useEffect, useState } from "react";
import type { Product } from "../../../../shared/types";
import { getProductById } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { API_URL } from "@/lib/const";

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Use useEffect to fetch product data by id using the params
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const prod = await getProductById(id as string);
          if (!prod.success) {
            setError(prod.error || "Error al cargar el producto.");
          }
          setProduct(prod.data);
        } catch (err) {
          setError("Error al cargar el producto.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };
  // With this set of if i handle the loading and error states
  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Cargando producto...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );

  if (!product)
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No se encontró el producto.</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products">
          <span className="inline-flex items-center px-3 py-2 border rounded text-sm bg-white hover:bg-gray-100 cursor-pointer">
            <span className="mr-2">←</span>
            Volver a productos
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="aspect-square relative overflow-hidden rounded-lg flex items-center justify-center bg-gray-100">
              <img
                src={`${API_URL}${product.image}`}
                alt={product.name}
                className="object-cover w-full h-full rounded-lg"
                style={{ maxHeight: 320, maxWidth: 320 }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xl font-semibold">${product.price}</p>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  product.isAvailable
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {product.isAvailable ? "En stock" : "Sin stock"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              className={`w-full px-4 py-3 rounded text-lg font-semibold ${
                product.isAvailable
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {product.isAvailable ? "Agregar al carrito" : "Sin stock"}
            </button>
            <button
              className={`w-full px-4 py-3 rounded text-lg font-semibold border mt-2 hover:cursor-pointer transition-colors duration-300 ${
                isFavorite
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              onClick={handleFavorite}
              type="button"
            >
              {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
