// ============================================================
//SPOTIFY API
const APIController = (function () {
    const clientId = "6cdb4aaca51d482791dc3281c2aabefc";
    const clientSecret = "b36f404230dd41689917861898d30714";

    // private methods
    const _getToken = async () => {
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
            },
            body: "grant_type=client_credentials",
        });

        const data = await result.json();
        return data.access_token;
    };

    const _getGenres = async (token) => {
        const result = await fetch(
            `https://api.spotify.com/v1/browse/categories?local=en_US`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + token },
            }
        );

        const data = await result.json();
        return data.categories.items;
    };

    const _getPlaylistByGenre = async (token, genreId) => {
        const limit = 10;

        const result = await fetch(
            `https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
            {
                method: "GET",
                headers: { Authorization: "Bearer " + token },
            }
        );

        const data = await result.json();
        return data.playlists.items;
    };

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });

        const data = await result.json();
        return data.items;
    };

    const _getTrack = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });

        const data = await result.json();
        return data;
    };

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
    };
})();

// UI Module
const UIController = (function () {
    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: "#select_genre",
        selectPlaylist: "#select_playlist",
        buttonSubmit: "#btn_submit",
        divSongDetail: "#song-detail",
        hfToken: "#hidden_token",
        divSonglist: ".song-list",
    };

    //public methods
    return {
        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
            };
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document
                .querySelector(DOMElements.selectGenre)
                .insertAdjacentHTML("beforeend", html);
        },

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document
                .querySelector(DOMElements.selectPlaylist)
                .insertAdjacentHTML("beforeend", html);
        },

        // need method to create a track list group item
        createTrack(id, name) {
            const html = `<a href="#" class="list-display" id="${id}">•${name}</a>`;
            document
                .querySelector(DOMElements.divSonglist)
                .insertAdjacentHTML("beforeend", html);
        },

        // need method to create the song detail
        createTrackDetail(img, title, artist) {
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = "";

            const html = `      
            <div class="genre" style="
            display: block;
            text-align: center;">
                <label for="Genre">${title}:</label>
            </div>
            <div class="artist" style="
            display: block;
            text-align: center;">
                <label for="artist">By ${artist}:</label>
            </div> 
            <div class="image" style="
            padding-bottom: 20px;">
            <img src="${img}" alt="">
            </div>  
            `;

            detailDiv.insertAdjacentHTML("beforeend", html);
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = "";
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = "";
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = "";
            this.resetTracks();
        },

        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value,
            };
        },
    };
})();

const APPController = (function (UICtrl, APICtrl) {
    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the genres
        const genres = await APICtrl.getGenres(token);
        //populate our genres select element
        genres.forEach((element) =>
            UICtrl.createGenre(element.name, element.id)
        );
    };

    // create genre change event listener
    DOMInputs.genre.addEventListener("change", async () => {
        //reset the playlist
        UICtrl.resetPlaylist();
        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;
        // get the genre select field
        const genreSelect = UICtrl.inputField().genre;
        // get the genre id associated with the selected genre
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        // ge the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
        // create a playlist list item for every playlist returned
        playlist.forEach((p) => UICtrl.createPlaylist(p.name, p.tracks.href));
    });

    // create submit button click event listener
    DOMInputs.submit.addEventListener("click", async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;
        // get the playlist field
        const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const tracksEndPoint =
            playlistSelect.options[playlistSelect.selectedIndex].value;
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        tracks.forEach((el) =>
            UICtrl.createTrack(el.track.href, el.track.name)
        );
    });

    // create song selection click event listener
    DOMInputs.tracks.addEventListener("click", async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        //get the track object
        const track = await APICtrl.getTrack(token, trackEndpoint);
        // load the track details
        UICtrl.createTrackDetail(
            track.album.images[2].url,
            track.name,
            track.artists[0].name
        );
    });

    return {
        init() {
            console.log("App is starting");
            loadGenres();
        },
    };
})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();
// GEOLOCATION
// function getGeolocation() {
// 	if (navigator.geolocation) {
// 		//check if geolocation is available
// 		navigator.geolocation.getCurrentPosition(function (position) {
// 			console.log(position);
// 			// reverse geocoding?
// 			// fetch( "http://maps.googleapis.com/maps/api/geocode/json?latlng="+ position.coords.latitude + "," + position.coords.longitude +"&sensor=false")
// 			//     .then(function(response) {
// 			//         return response.json()
// 			//     })
// 			//     .then(function(data) {
// 			//         console.log(data);
// 			//     })
// 		});
// 	}
// }

// getGeolocation();

// window.onSpotifyWebPlaybackSDKReady = () => {
// 	const token =
// 		"[BQBLAH4n-wN2yiCfoXvMt179Ok1Rn-tEFA-O9bU5RDVSrPKzZ1iWOFbx8OiY_h82AGY4P7YSiNmSxMxT2AyEBX1pDXsDAT3GEMXhpqWBwhvu9J4Xg0jbKCNhKL-nWjF1fcvCAlXOjKfEj2KcYMcWtT34gEErZCTxHHYc7RVk]";
// 	const player = new Spotify.Player({
// 		name: "Daily Deck Player",
// 		getOAuthToken: (cb) => {
// 			cb(token);
// 		},
// 		volume: 0.5,
// 	});
// };

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
