"use client";
import { useState } from "react";
import { useCart } from "../context/cartcontext";
import { useOrders, Order } from "../context/OrdersContext";
import { LogOut, MapPin, ShoppingBag, User } from "lucide-react";

export default function AccountPage() {
  const { clearCart } = useCart();
  const { orders, clearOrders } = useOrders();
  const [viewDetails, setViewDetails] = useState<{ [key: number]: boolean }>({});

  const user = {
    name: "Jershii",
    phone: "1875468890",
    email: "jershi@gmail.com",
    address: {
      street: "123 Main St",
      city: "Cityville",
      state: "Tamilnadu",
      pincode: "675456",
      country: "India",
    },
  };

  const handleLogout = () => {
    clearCart();
    clearOrders();
    alert("Logged out successfully!");
  };

  const toggleDetails = (id: number) => {
    setViewDetails({ ...viewDetails, [id]: !viewDetails[id] });
  };

  return (
    <div className="max-w-5xl mx-auto min-h-screen ">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-b-3xl shadow-md p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm">{user.email}</p>
          <p className="text-sm">{user.phone}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Address Section */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
            <MapPin className="w-5 h-5 text-blue-600" /> Delivery Address
          </h2>
          <p className="text-gray-700">
            {user.address.street}, {user.address.city}
          </p>
          <p className="text-gray-700">
            {user.address.state} - {user.address.pincode}
          </p>
          <p className="text-gray-700">{user.address.country}</p>
        </div>

        {/* Orders Section */}
        <div className="bg-white p-5 rounded-2xl shadow-md">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
            <ShoppingBag className="w-5 h-5 text-purple-600" /> Order History
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">You have no orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order: Order) => {
                const itemsTotal = order.items.reduce(
                  (sum, item) => sum + item.price * (item.qty || 1),
                  0
                );
                const orderTotal = itemsTotal + (order.delivery || 0) - (order.discount || 0);

                return (
                  <div
                    key={order.id}
                    className="border rounded-xl p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <p className="font-semibold text-gray-800">Order #{order.id}</p>
                        <p className="text-gray-700">Total: ₹{order.total.toFixed(2)}</p>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleDetails(order.id)}
                        className="mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm transition"
                      >
                        {viewDetails[order.id] ? "Hide Details" : "View Details"}
                      </button>
                    </div>

                    {viewDetails[order.id] && (
                      <div className="mt-4 border-t pt-4 space-y-3">
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col items-center min-w-[80px]"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow"
                                />
                              )}
                              <span className="text-xs text-gray-700 text-center mt-1">
                                {item.name} x{item.qty || 1}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-2 text-gray-700 space-y-1 text-sm">
                          <p>Items Total: ₹{itemsTotal.toFixed(2)}</p>
                          <p>Delivery:  ₹{order.delivery?.toFixed(2) || "0.00"}</p>
                          <p>Discount: - ₹{order.discount?.toFixed(2) || "0.00"}</p>
                          <p className="font-bold text-gray-900">
                            Order Total:  ₹{orderTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg transition font-semibold"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
