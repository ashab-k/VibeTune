"use client";
import { useState } from "react";

export default function SearchMusic() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await fetch("http://0.0.0.0:4000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k: 20, similarity_threshold: 0.2 }),
    });

    const data = await response.json();
    setResults(data.songs);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">VibeTune: Music Search</h1>
      <input
        type="text"
        placeholder="Enter mood, artist, or genre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 m-2 w-96"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Search
      </button>

      <ul className="mt-4">
        {results.map((song: any, index) => (
          <li key={index} className="p-2 border-b">
            🎵 {song.track} - {song.artist} ({song.genre})
          </li>
        ))}
      </ul>
    </div>
  );
}
