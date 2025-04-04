"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SpotifyUserProfile } from "@/types/types";
import { Loader2 } from "lucide-react";

const Page: React.FC = () => {
  const { data: sessions } = useSession();
  const [profileData, setProfileData] = useState<SpotifyUserProfile | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = sessions?.user.accessToken;

  const fetchProfileData = async () => {
    if (!token) {
      console.error("No access token available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(
          `Error ${result.status}: ${
            errorData.error?.message || result.statusText
          }`
        );
      }

      const data = await result.json();
      setProfileData(data);
    } catch (error: any) {
      console.error("Failed to fetch data", error.message);
      setError(error.message);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Wait for token to initialize
      fetchProfileData();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            Spotify Profile
          </h1>
          <p className="text-gray-400">View your Spotify profile information</p>
        </header>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-green-400 animate-spin" />
            <span className="ml-2 text-gray-400">Loading profile data...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-400 font-medium">Error loading profile</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {!loading && !error && !profileData && (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">
              No profile data available. Please make sure you're logged in.
            </p>
          </div>
        )}

        {profileData && (
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            {/* Profile Header */}
            <div className="relative">
              <div className="bg-gradient-to-r from-green-900/40 to-purple-900/40 h-32 md:h-40"></div>

              <div className="flex flex-col md:flex-row items-center px-6 py-4 -mt-12 md:-mt-16">
                <div className="z-10">
                  {profileData.images && profileData.images[0] ? (
                    <img
                      src={profileData.images[0].url}
                      alt="Profile"
                      className="rounded-full border-4 border-gray-800 w-24 h-24 md:w-32 md:h-32 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="rounded-full border-4 border-gray-800 bg-gray-700 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shadow-lg">
                      <span className="text-4xl text-gray-500">?</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <h2 className="text-2xl font-bold">
                    {profileData.display_name}
                  </h2>
                  {profileData.email && (
                    <p className="text-gray-400">{profileData.email}</p>
                  )}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                    {profileData.product && (
                      <span className="bg-green-900/60 text-green-300 text-xs px-2 py-1 rounded-full">
                        {profileData.product.charAt(0).toUpperCase() +
                          profileData.product.slice(1)}
                      </span>
                    )}
                    {profileData.followers && (
                      <span className="bg-purple-900/60 text-purple-300 text-xs px-2 py-1 rounded-full">
                        {profileData.followers.total} Followers
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Account Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ID:</span>
                      <span className="text-gray-200 font-mono text-sm truncate max-w-xs">
                        {profileData.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country:</span>
                      <span className="text-gray-200">
                        {profileData.country || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Product:</span>
                      <span className="text-gray-200">
                        {profileData.product || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Profile Links
                  </h3>
                  <div className="space-y-2">
                    {profileData.external_urls && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spotify:</span>
                        <a
                          href={profileData.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 truncate max-w-xs"
                        >
                          Open Profile
                        </a>
                      </div>
                    )}
                    {profileData.href && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">API:</span>
                        <span className="text-gray-200 font-mono text-sm truncate max-w-xs">
                          {profileData.href}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Section - Collapsible */}
            <details className="bg-gray-900/80 p-4 border-t border-gray-700">
              <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                Debug Information
              </summary>
              <div className="mt-2 bg-gray-800 p-3 rounded overflow-auto max-h-60">
                <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
