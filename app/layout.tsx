import "./globals.css";
import { CartProvider } from "./context/cartcontext";
import { OrdersProvider } from "./context/OrdersContext";
import Navbar from "./components/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <OrdersProvider>
          <CartProvider>
            <Navbar />
            <main className="pt-20">{children}</main>
          </CartProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
