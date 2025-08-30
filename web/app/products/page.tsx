"use client";

import React, { useEffect, useState } from "react";
import type { Filters, Product } from "../../../shared/types";
import { getProducts, getTopCheapest } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

//State the number of products per page, this to calculate pagination
const PRODUCTS_PER_PAGE = 10;

export default function ProductsPage() {
  //Use a filter state to manage the product filters
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    sort: "name",
    order: "asc",
    available: "",
    page: 1,
  });

  //States to manage products, loading, errors, pagination and top cheapest products
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);

  const [topCheapest, setTopCheapest] = useState<Product[]>([]);
  const [loadingCheapest, setLoadingCheapest] = useState(false);
  const [errorCheapest, setErrorCheapest] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(0);

  //Fetch products when filters change using useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorProducts(null);
      try {
        const res = await getProducts({
          search: filters.searchTerm,
          sort: filters.sort,
          order: filters.order,
          page: filters.page.toString(),
          limit: PRODUCTS_PER_PAGE.toString(),
          available: filters.available,
        });
        if (!res.success) {
          setErrorProducts(res.error || "Error al cargar productos");
          setProducts([]);
          setTotalProducts(0);
        } else {
          setProducts(res.data.products);
          setTotalProducts(res.data.total);
          const totalPages = Math.ceil(res.data.total / PRODUCTS_PER_PAGE);
          setTotalPages(totalPages);
        }
      } catch {
        setErrorProducts("Error de conexión al cargar productos");
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  // fetch top cheapest products
  useEffect(() => {
    const fetchCheapest = async () => {
      setLoadingCheapest(true);
      setErrorCheapest(null);
      try {
        const res = await getTopCheapest(3);
        if (!res.success) {
          setErrorCheapest(res.error || "Error al cargar productos baratos");
          setTopCheapest([]);
        } else {
          setTopCheapest(res.data);
        }
      } catch {
        setErrorCheapest("Error de conexión al cargar productos baratos");
        setTopCheapest([]);
      } finally {
        setLoadingCheapest(false);
      }
    };
    fetchCheapest();
  }, []);

  // A function to handle filter changes
  function handleFilterChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  }

  // A function to handle page changes
  function handlePageChange(newPage: number) {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  }

  // This function renders the section for the top cheapest products including loading and error
  function renderCheapestSection() {
    if (loadingCheapest) {
      return (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Cargando...</p>
        </div>
      );
    }
    if (errorCheapest) {
      return (
        <div className="text-center py-4 text-red-500">
          <p>{errorCheapest}</p>
        </div>
      );
    }
    if (topCheapest.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500">No hay productos baratos disponibles.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topCheapest.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="block"
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    );
  }

  // This function renders the section for the products including loading and error too, besides this has the pagination

  function renderProductsSection() {
    if (loading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Cargando productos...</p>
        </div>
      );
    }
    if (errorProducts) {
      return (
        <div className="text-center py-12 text-red-500">
          <p>{errorProducts}</p>
        </div>
      );
    }
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron productos que coincidan con los filtros
            seleccionados.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block"
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded bg-blue-600 cursor-pointer text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
            disabled={filters.page === 1}
          >
            Anterior
          </button>
          <span>
            Página {filters.page} de {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-blue-600 cursor-pointer text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() =>
              handlePageChange(Math.min(totalPages, filters.page + 1))
            }
            disabled={filters.page === totalPages}
          >
            Siguiente
          </button>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          Mostrando{" "}
          {products.length === 0
            ? 0
            : (filters.page - 1) * PRODUCTS_PER_PAGE + 1}
          -
          {products.length === 0
            ? 0
            : (filters.page - 1) * PRODUCTS_PER_PAGE + products.length}{" "}
          de {totalProducts} productos
        </div>
      </>
    );
  }
  // Finally this return render the filters and the products section using the previus two functions
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Productos</h1>
        <p className="text-gray-500">
          Descubre nuestra amplia selección de productos
        </p>
      </div>

      <form
        className="flex flex-col md:flex-row gap-4 mb-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          name="searchTerm"
          placeholder="Buscar producto..."
          value={filters.searchTerm}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="name">Nombre</option>
          <option value="price">Precio</option>
        </select>
        <select
          name="order"
          value={filters.order}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
        <select
          name="available"
          value={filters.available ?? ""}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="">Todos</option>
          <option value="true">En stock</option>
          <option value="false">Sin stock</option>
        </select>
      </form>

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">
          Top 3 productos más baratos disponibles
        </h2>
        {renderCheapestSection()}
      </div>

      <h2 className="text-xl font-bold mb-4">Todos los productos</h2>
      {renderProductsSection()}
    </div>
  );
}
