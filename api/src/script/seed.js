import { MongoClient } from "mongodb";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("mini-marketplace");
    const collection = db.collection("products");

    const filePath = path.join(__dirname, "../data/products.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const { products } = JSON.parse(raw);

    await collection.deleteMany({});
    await collection.insertMany(products);

    console.log("Seed completed successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.close();
  }
}

seed();
