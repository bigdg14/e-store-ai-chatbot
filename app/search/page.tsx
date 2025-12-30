"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";

export default function Search() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        router.push(`/searchResults?s=${encodeURIComponent(searchTerm)}`);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm, router]);


  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(ev.target.value);
  };

  return (
    <div id="search" className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        type="text"
        name="search"
        id="search"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for products..."
        className="border p-2 rounded-md w-full bg-white text-black dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}
