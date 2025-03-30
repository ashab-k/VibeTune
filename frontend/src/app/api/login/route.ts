import { NextResponse } from "next/server";
import crypto from "crypto";
import querystring from "querystring";

export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = "http://127.0.0.1:3000";
  const state = crypto.randomBytes(8).toString("hex"); // Generate random state
  const scope = "user-read-private user-read-email";

  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
      state,
    });

  return NextResponse.redirect(authUrl);
}
