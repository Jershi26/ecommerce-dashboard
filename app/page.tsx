"use client";
import { useState } from "react";
import { useCart } from "./context/cartcontext";
import Image from "next/image";
import { Search } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { products } from "./data/products";

const categories = [
  { name: "Electronics", img: "/images/electronics.jpg" },
  { name: "Appliances", img: "/images/appliances.jpg" },
  { name: "Fashion", img: "/images/fashion.jpg" },
  { name: "Kitchen", img: "/images/kitchen.jpg" },
  { name: "Beauty", img: "/images/beauty.jpg" },
  { name: "Groceries", img: "/images/groceries.jpg" },
  { name: "Stationery", img: "/images/stationery.jpg" },
  { name: "Toys", img: "/images/toys.jpg" },
  { name: "Books", img: "/images/books.jpg" },
];

export default function Home() {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 max-w-7xl mx-auto">
      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-20 py-3 mb-4 ">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for amazing products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 bg-gray-50 py-3 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm sm:text-base pr-12"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">
          🛍️ShopVerce Catalog
        </h1>
      </div>

      {/* Categories Section */}
      <div className="overflow-x-auto scrollbar-hide mb-8">
        <div className="flex gap-10">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="flex-shrink-0 cursor-pointer flex flex-col items-center"
              onClick={() => router.push(`/categories/${cat.name.toLowerCase()}`)}
            >
              {/* Circle Image */}
              <div className="w-20 h-20 relative rounded-full overflow-hidden shadow-md hover:shadow-xl transition mb-2">
                <Image src={cat.img} alt={cat.name} fill className="object-cover" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No products found ❌</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 justify-center">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-full sm:w-72 lg:w-80 mx-auto flex flex-col border-t-4 border-blue-500"
            >
              {/* Offer & Bestseller Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {p.offer && p.offer > 0 && (
                  <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {p.offer}% OFF
                  </span>
                )}
                {p.bestseller && (
                  <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Product Image */}
              <div className="flex justify-center items-center h-40 sm:h-44 lg:h-48 bg-gray-50 rounded-t-2xl">
                <Image
                  src={p.image}
                  alt={p.name}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-1">
                  {p.name}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mb-2">
                  {p.description}
                </p>

                {/* Price + Offer */}
                <div className="flex items-center gap-2 mb-2">
                  {p.offer && p.offer > 0 ? (
                    <>
                      <p className="text-gray-400 line-through text-sm">₹{p.price}</p>
                      <p className="text-green-600 font-bold text-sm">
                        ₹{Math.round(p.price - (p.price * p.offer) / 100)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-800 font-bold text-sm">₹{p.price}</p>
                  )}
                </div>

                {/* Rating */}
                <p className="text-yellow-500 text-xs sm:text-sm mb-3">
                  {"⭐".repeat(Math.floor(p.rating))} ({p.rating})
                </p>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(p)}
                  className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition text-sm sm:text-base"
                >
                  Add to Cart🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
