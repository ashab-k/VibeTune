"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";

export default function SearchMusic() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { data: session } = useSession();

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
      <div className="flex flex-row justify-between">
        {" "}
        <h1 className="text-2xl font-bold">VibeTune: Music Search</h1>
        <div>
          {session ? (
            <>
              <p>Welcome, {session.user.name}</p>
              <p>Access Token: {session.user.accessToken}</p>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("spotify")}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Login with Spotify
            </button>
          )}
        </div>
      </div>

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
