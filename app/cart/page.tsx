"use client";
import Image from "next/image";
import { useCart } from "../context/cartcontext";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, addToCart } = useCart();
  const router = useRouter();

  const DELIVERY_PRICE = 20;

  const itemsOriginalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.qty || 1),
    0
  );

  const discountPrice = cart.reduce(
    (sum, item) =>
      sum + ((item.price * (item.offer || 0)) / 100) * (item.qty || 1),
    0
  );

  const orderTotal = itemsOriginalPrice - discountPrice + DELIVERY_PRICE;

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-gray-800 text-center">
        🛒 Your Cart
      </h1>

      {cart.length > 0 && (
        <p className="text-gray-600 mb-6 text-center text-lg">
          {cart.length} item{cart.length > 1 ? "s" : ""} in your cart
        </p>
      )}

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-6">
          <p className="text-gray-600 text-lg text-center">
            Your cart is empty.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            🛍️Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.map((p) => {
                const priceAfterDiscount = p.offer
                  ? p.price - (p.price * (p.offer || 0)) / 100
                  : p.price;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-2xl p-4 bg-white shadow-md hover:shadow-xl transform hover:scale-[1.02] transition"
                  >
                    {/* Product Image */}
                    {p.image && (
                      <div className="w-24 h-24 relative flex-shrink-0 mb-2 sm:mb-0">
                        <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full relative">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </motion.div>
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="flex flex-col flex-1 sm:ml-4 gap-1 w-full">
                      <p className="font-semibold text-gray-800 text-lg">
                        {p.name}
                      </p>
                      <div className="flex gap-2 items-center flex-wrap">
                        {p.offer && (
                          <p className="text-gray-400 line-through text-sm">
                            ₹{p.price.toFixed(2)}
                          </p>
                        )}
                        <p className="text-emerald-600 font-bold">
                          ₹{priceAfterDiscount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <button
                        onClick={() => addToCart(p, -1)}
                        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        <Minus size={18} />
                      </button>

                      <motion.span
                        key={p.qty}
                        className="px-3 font-semibold"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {p.qty || 1}
                      </motion.span>

                      <button
                        onClick={() => addToCart(p, 1)}
                        className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Subtotal & Checkout */}
          <div className="p-6 rounded-2xl bg-gray-50 shadow-md md:sticky md:top-20 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Subtotal</h2>
            <div className="flex flex-col gap-2 text-gray-700">
              <div className="flex justify-between">
                <span>Items Original Price:</span>
                <span>₹{itemsOriginalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>₹{DELIVERY_PRICE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>- ₹{discountPrice.toFixed(2)}</span>
              </div>
              <p className="text-emerald-600 text-sm mt-2 font-medium">
                🎉You saved ₹{discountPrice.toFixed(2)} today!
              </p>
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between font-bold text-lg">
                <span>Order Total:</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl w-full text-lg font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              ✅Proceed to Buy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

