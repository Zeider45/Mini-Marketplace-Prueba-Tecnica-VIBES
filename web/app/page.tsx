import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a nuestra tienda</h1>
        <p className="text-xl text-gray-500 mb-8">
          Descubre productos increíbles con la mejor experiencia de compra
        </p>
        <Link href="/products">
          <span className=" items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Ver productos
          </span>
        </Link>
      </div>
    </div>
  );
}
