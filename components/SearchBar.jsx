"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`/api/product/search?q=${value}`);
      setResults(res.data.results);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleSelect = (id) => {
    setQuery("");
    setResults([]);
    router.push(`/product/${id}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search products..."
        className="w-full p-2 rounded-xl border border-gray-300 focus:outline-none"
      />

      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-xl mt-1 w-full max-h-80 overflow-y-auto shadow-lg">
          {results.map((item) => (
            <li
              key={item._id}
              onClick={() => handleSelect(item._id)}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
            >
              {/* product thumbnail */}
              {item.image?.[0] && (
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}

              {/* product info */}
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-500">
                  ${item.offerPrice || item.price}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
