window.onSpotifyWebPlaybackSDKReady = () => {
    const token =
        "[BQBLAH4n-wN2yiCfoXvMt179Ok1Rn-tEFA-O9bU5RDVSrPKzZ1iWOFbx8OiY_h82AGY4P7YSiNmSxMxT2AyEBX1pDXsDAT3GEMXhpqWBwhvu9J4Xg0jbKCNhKL-nWjF1fcvCAlXOjKfEj2KcYMcWtT34gEErZCTxHHYc7RVk]";
    const player = new Spotify.Player({
        name: "Daily Deck Player",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });
};

function authenticate() {
    return gapi.auth2
        .getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
        .then(
            function () {
                console.log("Sign-in successful");
            },
            function (err) {
                console.error("Error signing in", err);
            }
        );
}
function loadClient() {
    gapi.client.setApiKey("AIzaSyCfqsPZ0YjzBXqDJrLbvpahofL7bg0jHxQ");
    return gapi.client
        .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(
            function () {
                console.log("GAPI client loaded for API");
            },
            function (err) {
                console.error("Error loading GAPI client for API", err);
            }
        );
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
    return gapi.client.youtube.videos
        .list({
            part: ["snippet,contentDetails,statistics"],
            chart: "mostPopular",
            regionCode: "US",
        })
        .then(
            function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
            function (err) {
                console.error("Execute error", err);
            }
        );
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "YOUR_CLIENT_ID" });
});
