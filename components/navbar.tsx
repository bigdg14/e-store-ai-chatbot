"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, Search, Sun, Moon, X } from "lucide-react";
import { useCart } from "@/context/cartContext";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { cart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (!storedTheme || storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    // Reset searchTerm when navigating to a new page
    setSearchTerm("");
  }, [router]); 


  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const submitSearch = () => {
    if (searchTerm.trim().length === 0) return; // Prevents empty searches

    console.log("🔍 Submitting search for:", searchTerm); // Debugging log
    router.push(`/searchResults?s=${encodeURIComponent(searchTerm)}`);
  };



  return (
    <header className="bg-white dark:bg-gray-900 border-b border-[#ffffff] shadow-md transition-all">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#e5c888]">
          E-Store
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="hover:text-[#947ac0] transition-all">
            About
          </Link>
          <Link
            href="/categories"
            className="hover:text-[#947ac0] transition-all"
          >
            Categories
          </Link>
          <Link href="/contact" className="hover:text-[#947ac0] transition-all">
            Contact
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center border rounded-md px-3 py-2 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-64 bg-transparent outline-none text-black dark:text-white"
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()} // 🔹 Press Enter to search
            />
            <Button
              onClick={submitSearch}
              className="absolute right-3 text-[#e5c888] dark:text-[#947ac0]"
            >
              <Search size={20} />
            </Button>
          </div>

          {/* Dark Mode Toggle */}
          <Button onClick={toggleDarkMode} className="p-2 rounded-md">
            {darkMode ? (
              <Sun className="text-[#e5c888] dark:text-white hover:text-white" />
            ) : (
              <Moon className="text-[#e5c888] dark:text-[#947ac0] hover:text-[#947ac0]" />
            )}
          </Button>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="text-[#e5c888] hover:text-[#947ac0] transition-all" />
            {cart.length > 0 && (
              <span className="text-[#e5c888] dark:text-[#e5c888] hover:text-[#947ac0] transition-all">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Navigation & Search */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Search Icon (Opens Modal) */}
          <Button onClick={() => setSearchOpen(true)}>
            <Search className="text-[#e5c888] hover:text-[#947ac0]" />
          </Button>

          {/* Mobile Menu Button */}
          <Button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="text-[#e5c888] hover:text-[#947ac0] transition-all" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-black shadow-lg md:hidden flex flex-col items-center space-y-4 py-4 transition-all">
            <Link
              href="/about"
              className="hover:text-[#947ac0] transition-all"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/categories"
              className="hover:text-[#947ac0] transition-all"
              onClick={() => setIsOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#947ac0] transition-all"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Button onClick={toggleDarkMode} className="p-2 rounded-md">
              {darkMode ? (
                <Sun className="text-[#e5c888] hover:text-white" />
              ) : (
                <Moon className="text-[#e5c888] hover:text-[#947ac0]" />
              )}
            </Button>
            <Link
              href="/cart"
              className="relative"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="text-[#e5c888] hover:text-[#947ac0] transition-all" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        )}
      </nav>

      {/* Floating Search Modal for Mobile */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            // Close only if clicking outside the modal
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-4/5 md:w-1/2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Search</h2>
              <Button
                onClick={() => {
                  console.log("Opening search modal..."); // Debugging log
                  setSearchOpen(true);
                }}
              >
                <X />
              </Button>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for products..."
              className="border p-2 rounded-md w-full mt-4"
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            />
          </div>
        </div>
      )}
    </header>
  );
}
