"use client";
import Image from "next/image";
import { useCart } from "../context/cartcontext";
import { Product } from "../data/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:scale-105 transition duration-300 w-full sm:w-72 lg:w-80 mx-auto flex flex-col border-t-4 border-blue-500">
      {/* Offer & Bestseller Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {product.offer && product.offer > 0 && (
          <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
            {product.offer}% OFF
          </span>
        )}
        {product.bestseller && (
          <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            Best Seller
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="flex justify-center items-center h-40 sm:h-44 lg:h-48 bg-gray-50 rounded-t-2xl">
        <Image
          src={product.image}
          alt={product.name}
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-1">
          {product.name}
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mb-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          {product.offer && product.offer > 0 ? (
            <>
              <p className="text-gray-400 line-through text-sm">
                ₹{product.price}
              </p>
              <p className="text-green-600 font-bold text-sm">
                ₹{Math.round(product.price - (product.price * product.offer) / 100)}
              </p>
            </>
          ) : (
            <p className="text-gray-800 font-bold text-sm">
              ₹{product.price}
            </p>
          )}
        </div>

        {/* Rating */}
        <p className="text-yellow-500 text-xs sm:text-sm mb-3">
          {"⭐".repeat(Math.floor(product.rating))} ({product.rating})
        </p>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          className="mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition text-sm sm:text-base"
        >
          Add to Cart🛒
        </button>
      </div>
    </div>
  );
}
