"use client";
import { useState } from "react";
import { useCart, Address } from "./../context/cartcontext";
import { useRouter } from "next/navigation";

type PaymentMethod = "card" | "upi" | "cod";

export default function CheckoutPage() {
  const { cart, placeOrder } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      </div>
    );
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!address.name) newErrors.name = "Name is required";
    if (!address.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(address.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!address.street) newErrors.street = "Street is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.state) newErrors.state = "State is required";
    if (!address.pincode) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(address.pincode))
      newErrors.pincode = "Pincode must be 6 digits";
    if (!address.country) newErrors.country = "Country is required";

    if (paymentMethod === "card") {
      if (!cardDetails.cardNumber) newErrors.cardNumber = "Card number required";
      else if (!/^\d{16}$/.test(cardDetails.cardNumber))
        newErrors.cardNumber = "Card number must be 16 digits";
      if (!cardDetails.name) newErrors.nameOnCard = "Name on card required";
      if (!cardDetails.expiry) newErrors.expiry = "Expiry required";
      if (!cardDetails.cvv) newErrors.cvv = "CVV required";
      else if (!/^\d{3,4}$/.test(cardDetails.cvv)) newErrors.cvv = "CVV invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    setIsSubmitting(true);
    const orderData = {
      address,
      paymentMethod,
      cardDetails: paymentMethod === "card" ? cardDetails : null,
    };
    placeOrder(address);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/orders");
    }, 500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        📝 Checkout
      </h1>

      {/* Address Section */}
      <div className="space-y-4 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "name",
            "phone",
            "street",
            "city",
            "state",
            "pincode",
            "country",
          ].map((field) => (
            <div
              key={field}
              className={
                field === "street" || field === "country"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <input
                type={field === "phone" || field === "pincode" ? "tel" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={address[field as keyof Address]}
                onChange={(e) =>
                  setAddress({ ...address, [field]: e.target.value })
                }
                className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Section */}
      <div className="space-y-4 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <div className="flex gap-4 items-center mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Card
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
            />
            UPI
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            Cash on Delivery
          </label>
        </div>

        {paymentMethod === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="tel"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
                className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Name on Card"
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, name: e.target.value })
                }
                className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.nameOnCard && (
                <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={cardDetails.expiry}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiry: e.target.value })
                }
                className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.expiry && (
                <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cvv: e.target.value })
                }
                className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>
        )}
        {paymentMethod === "upi" && (
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        )}
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isSubmitting}
        className={`mt-6 w-full px-6 py-3 rounded-xl text-lg font-semibold shadow-lg text-white transition transform hover:-translate-y-1 ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isSubmitting ? "Processing..." : "🛒 Place Order"}
      </button>
    </div>
  );
}
