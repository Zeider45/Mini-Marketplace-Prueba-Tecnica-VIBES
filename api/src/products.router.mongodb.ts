import { Router, type Request, type Response } from "express";
import { MongoClient } from "mongodb";
import type { ProductsQuery } from "../../shared/types.ts";

const router = Router();

const client = new MongoClient(process.env.MONGODB_URI || "");
const db = client.db("mini-marketplace");
const collection = db.collection("products");

router.get("/", async (req: Request, res: Response) => {
  try {
    await client.connect();

    const {
      search,
      sort,
      order,
      page = "1",
      limit = "10",
      available,
    } = req.query as ProductsQuery;
    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (available) {
      query.isAvailable = available === "true";
    }

    const options: any = {};
    if (sort) {
      options.sort = { [sort]: order === "desc" ? -1 : 1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const products = await collection
      .find(query, options)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .toArray();

    const total = await collection.countDocuments(query);

    res.json({ success: true, data: { products, total }, error: null });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, data: null, error: "Error leyendo productos" });
  }
});

router.get("/top-cheap", async (req: Request, res: Response) => {
  try {
    await client.connect();
    const topParam = req.query.top as string;
    const top = topParam ? parseInt(topParam, 10) : 3;

    if (isNaN(top) || top < 1) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro "top" inválido',
        data: null,
      });
    }

    const products = await collection
      .find({ isAvailable: true })
      .sort({ price: 1 })
      .limit(top)
      .toArray();

    res.status(200).json({
      success: true,
      data: products,
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

router.get("/:id", async (req: Request, res: Response) => {
  try {
    await client.connect();
    const product = await collection.findOne({ id: req.params.id });

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
