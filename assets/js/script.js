// GEOLOCATION;

// function getGeolocation() {
//     // console.log();

//     if (navigator.geolocation) {
//         //check if geolocation is available
//         navigator.geolocation.getCurrentPosition(
//             function (position) {
//                 console.log(
//                     "Position from end positon",
//                     position.coords.latitude,
//                     position.coords.longitude
//                 );
//                 getWeather(position.coords.latitude, position.coords.longitude);
//             },
//             function (error) {
//                 console.log(error);
//             }
//         );
//     }
// }

function getGeolocation() {
    // console.log();

    if (navigator.geolocation) {
        //check if geolocation is available
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position);
            getWeather(position.coords.latitude, position.coords.longitude);
        });
    }
}

getGeolocation();

// ===========================================================
// OPEN WEATHER
// Change this to your API key between the single quotes ('):

function getWeather(lat, lon) {
    var api_key = "ff5cface57f37613ff923c54e4f51a51";
    var requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&units=imperial&appid=`;

    fetch(requestUrl + api_key)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        });
    var tempFinal = 45 + "°";
    document.getElementById("weatherWidget").textContent = tempFinal;
}
getWeather();
// console.log(getWeather);

// ===========================================================
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
