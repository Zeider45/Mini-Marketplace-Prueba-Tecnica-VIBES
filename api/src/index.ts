import express from "express";
import cors from "cors";
import jsonProductsRouter from "./products.router";
import mongoProductsRouter from "./products.router.mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Use the cors middleware to allow access from other domains
app.use(cors());

// Use the middleware to parse the body of requests in JSON format
app.use(express.json());

// Use the express.static middleware to serve static files
app.use(express.static("src/public"));

// Using JSON router
// app.use("/api/products", jsonProductsRouter);
// Using MongoDB router
app.use("/api/products", mongoProductsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
