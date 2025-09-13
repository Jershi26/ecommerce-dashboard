"use client";
import { useOrders, OrderStatus } from "../context/OrdersContext";
import Image from "next/image";
import { motion } from "framer-motion";

const STATUS_STEPS: OrderStatus[] = ["Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function OrdersPage() {
  const { orders } = useOrders();

  if (orders.length === 0) {
    return (
      <div className="p-6 max-w-5xl mx-auto min-h-screen flex flex-col items-center justify-center gap-6">
       
        <p className="text-gray-600 text-lg text-center">
          You haven’t placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen space-y-6">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        📝 Your Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            className="bg-white rounded-2xl shadow-lg p-6 transition transform hover:scale-105"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div className="text-gray-700">
                <p>
                  <span className="font-semibold">Order ID:</span> {order.id}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(order.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Items:</span>{" "}
                  {order.items.reduce((sum, item) => sum + (item.qty || 1), 0)}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <p className="font-semibold text-lg text-green-600">
                  Total: ₹{order.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-2">
                {STATUS_STEPS.map((step) => (
                  <span
                    key={step}
                    className={`flex-1 text-center ${
                      STATUS_STEPS.indexOf(step) <=
                      STATUS_STEPS.indexOf(order.status)
                        ? "text-green-600 font-semibold"
                        : ""
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
              <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-green-600 h-2 transition-all"
                  style={{
                    width: `${(STATUS_STEPS.indexOf(order.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-800">Delivery Address</h3>
              <p>{order.address.name}, {order.address.phone}</p>
              <p>
                {order.address.street}, {order.address.city}, {order.address.state} - {order.address.pincode}, {order.address.country}
              </p>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              {order.items.map((item) => {
                const priceAfterDiscount = item.offer
                  ? item.price - (item.price * (item.offer || 0)) / 100
                  : item.price;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl p-3 bg-gray-50 shadow-sm transition transform hover:scale-105"
                  >
                    {item.image && (
                      <div className="w-16 h-16 relative flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <div className="flex gap-2 items-center flex-wrap">
                        {item.offer && (
                          <p className="text-gray-400 line-through text-sm">
                            ₹{item.price.toFixed(2)}
                          </p>
                        )}
                        <p className="text-green-600 font-bold">
                          ₹{priceAfterDiscount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">x {item.qty || 1}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}