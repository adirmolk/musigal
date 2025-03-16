const fetch = require("node-fetch");
exports.getWebAccessToken = async function getWebAccessToken(spDcCookie) {
  try {
    const res = await fetch(
      "https://open.spotify.com/get_access_token?reason=transport&productType=web_player",
      {
        headers: {
          Cookie: `sp_dc=${spDcCookie}`,
        },
      }
    );

    console.log("Raw Response:", res);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Parsed JSON Response:", data); // Log response

    return data.accessToken || null; // Ensure accessToken is returned
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return null;
  }
};

exports.getFriendActivity = async function getFriendActivity(webAccessToken) {
  const res = await fetch(
    "https://guc-spclient.spotify.com/presence-view/v1/buddylist",
    {
      headers: {
        Authorization: `Bearer ${webAccessToken}`,
      },
    }
  );
  console.log(res);

  return res.json();
};

exports.wrapWebApi = function wrapWebApi(api) {
  const Request = require("spotify-web-api-node/src/base-request");
  const HttpManager = require("spotify-web-api-node/src/http-manager");

  api.getWebAccessToken = function getWebAccessToken(callback) {
    const { spDcCookie } = this.getCredentials();

    return Request.builder()
      .withHost("open.spotify.com")
      .withPort(443)
      .withScheme("https")
      .withPath("/get_access_token")
      .withQueryParameters({
        reason: "transport",
        productType: "web_player",
      })
      .withHeaders({
        Accept: "application/json",
        Cookie: `sp_dc=${spDcCookie}`,
      })
      .build()
      .execute(HttpManager.get, callback);
  };

  api.getFriendActivity = function getFriendActivity(callback) {
    return Request.builder()
      .withHost("guc-spclient.spotify.com")
      .withPort(443)
      .withScheme("https")
      .withAuth(this.getAccessToken())
      .withPath("/presence-view/v1/buddylist")
      .build()
      .execute(HttpManager.get, callback);
  };

  return api;
};
