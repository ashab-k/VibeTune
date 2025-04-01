"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SpotifyUserProfile } from "@/types/types";

const page: React.FC = () => {
  const { data: sessions } = useSession();
  const [profileData, setProfileData] = useState<SpotifyUserProfile | null>(
    null
  );
  const token = sessions?.user.accessToken;

  const fetchProfileData = async () => {
    if (!token) {
      console.error("No access token available");
      return;
    }

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
      setProfileData(null);
    }
  };

  useEffect(() => {
    if (token) {
      //wait for token to initialize
      fetchProfileData();
    }
  }, [token]);

  return (
    <>
      <div>{JSON.stringify(profileData)}</div>
      <div>{token}</div>
    </>
  );
};

export default page;
