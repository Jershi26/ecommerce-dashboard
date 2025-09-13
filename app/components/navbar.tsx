"use client";

import Link from "next/link";
import { useCart } from "../context/cartcontext";
import { useState } from "react";
import { HiMenu, HiX, HiHome, HiShoppingCart } from "react-icons/hi";
import { FaClipboardList, FaChartLine, FaUser } from "react-icons/fa";

export default function Navbar() {
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: <HiHome /> },
    { name: "Orders", href: "/orders", icon: <FaClipboardList /> },
    { name: "Analytics", href: "/analytics", icon: <FaChartLine /> },
    { name: "Account", href: "/account", icon: <FaUser /> },
    { name: "Cart", href: "/cart", icon: <HiShoppingCart /> },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-800 text-white shadow-md">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl sm:text-3xl font-black">🌌ShopVerse</h1>

        {/* Desktop Menu */}
        <nav className="hidden sm:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-1 hover:text-yellow-400 transition"
            >
              {item.icon}
              {item.name === "Cart" && cart.length > 0 ? (
                <span className="ml-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              ) : (
                <span>{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="sm:hidden bg-gray-800 px-4 pb-4">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 hover:text-yellow-400 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                  {item.name === "Cart" && cart.length > 0 && (
                    <span className="ml-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
