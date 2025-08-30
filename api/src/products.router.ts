import { Router, type Request, type Response } from "express";
import type { ProductsQuery } from "../../shared/types.js";
import type { Product } from "../../shared/types.js";
import productsData from "./data/products.json" assert { type: "json" };
import { getTopCheapestAvailable } from "../../shared/utils.js";

const router = Router();
let products: Product[] = productsData.products;

router.get("/", (req: Request, res: Response) => {
  const TOTAL_PRODUCTS = products.length;
  try {
    let result = [...products];
    if (!result) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Products not found",
      });
    }

    const {
      search,
      sort,
      order,
      page = "1",
      limit = "10",
      available,
    } = req.query as ProductsQuery;

    if (search && typeof search === "string") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (available === "true") result = result.filter((p) => p.isAvailable);
    if (available === "false") result = result.filter((p) => !p.isAvailable);

    // Order the results by the specified Product property
    if (sort && typeof sort === "string") {
      result.sort((a, b) => {
        if (order === "asc") {
          return a[sort] > b[sort] ? 1 : -1;
        } else {
          return a[sort] < b[sort] ? 1 : -1;
        }
      });
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    result = result.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        total: TOTAL_PRODUCTS,
        products: result,
      },
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: "Internal Server Error",
    });
  }
});

router.get("/top-cheap", (req: Request, res: Response) => {
  try {
    const topParam = req.query.top as string;
    const top = topParam ? parseInt(topParam, 10) : 3;

    if (isNaN(top) || top < 1) {
      return res.status(400).json({ error: 'Parámetro "top" inválido' });
    }

    const cheapestProducts = getTopCheapestAvailable(products, top);

    res.status(200).json({
      success: true,
      data: cheapestProducts,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: "Internal Server Error",
    });
  }
});

router.get("/:id", (req: Request, res: Response) => {
  try {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      data: null,
      error: "Internal server error",
    });
  }
});

export default router;
