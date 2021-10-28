// GEOLOCATION
function getGeolocation() {
    if (navigator.geolocation) {
        //check if geolocation is available
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            // reverse geocoding?
            // fetch( "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&sensor=false")
            //     .then(function(response) {
            //         return response.json()
            //     })
            //     .then(function(data) {
            //         console.log(data);
            //     })
        });
    }
    // check if saved, don't prompt?
    // button to prompt? (weather)
}

getGeolocation();

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

// ============================================================
// YOUTUTBE API

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player("youtubeCard", {
        height: "390",
        width: "640",
        playerVars: {
            listType: "playlist",
            list: "PLrEnWoR732-BHrPp_Pm8_VleD68f9s14-",
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes. The function indicates that when playing a video (state=1) the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}

// ===============================================================
// Stocks API
//check if we have stocks already in locastorage
// no ? run the fetch
// yes ? use the stocks from local storage
// fetch(
//     "https://financialmodelingprep.com/api/v3/actives?apikey=a0b34495f1b7cdb84c38ee2d58875f0a"
// )
//     .then((res) => {
//         console.log(res);
//         return res.json();
//     })
//     .then((data) => {
//         localStorage.setItem("stocks", JSON.stringify(data));
//         console.log(data);
//     });
if (localStorage.getItem("stocks") === null) {
    fetch(
        "https://financialmodelingprep.com/api/v3/actives?apikey=a0b34495f1b7cdb84c38ee2d58875f0a"
    )
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((data) => {
            // appened an unordered list to the stockContainer list
            // then appened individual list items to the unorderd list
            localStorage.setItem("stocks", JSON.stringify(data));
            console.log(data);
        });
}

// function stockContainer(data) {
//     var stockCard = document.getElementById("stocks-card");

//     //  var aaplTicker = aapl.ticker;
// }
// var aapl = JSON.parse(localStorage.getItem("data[1].ticker"));
// console.log(aapl);
// stockContainer();
// // stockCard.textContent = aaplTicker;
