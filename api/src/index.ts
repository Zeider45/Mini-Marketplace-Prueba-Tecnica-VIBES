import express from "express";
import cors from "cors";
import productsRouter from "./products.router";

const app = express();
const PORT = process.env.PORT || 3001;

// Use the cors middleware to allow access from other domains
app.use(cors());

// Use the middleware to parse the body of requests in JSON format
app.use(express.json());

// Use the express.static middleware to serve static files
app.use(express.static("src/public"));

app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
