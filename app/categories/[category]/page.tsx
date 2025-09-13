"use client";
import { useParams, useRouter } from "next/navigation";
import { products } from "../../data/products"; 
import ProductCard from "../../components/productcard";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params?.category as string) || "";

  // Filter products by category
  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="px-4 max-w-7xl mx-auto min-h-screen">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold capitalize text-gray-800">
          {category} Products
        </h1>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full shadow-sm transition"
        >
          ⬅ Back to Home
        </button>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-lg">No products found in {category} ❌</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
