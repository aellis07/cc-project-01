const APIController = function () {
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
            `https://api.spotify.com/v1/browse/categories?locale=en_US`,
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
            songDetail: document.querySelector(DOMElements.divSongDetail)
        }
    },

    // need methods to create select list option
    createGenre(text, value) {
        const html = `<option value="${value}">${text}</option>`;
        document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
    }, 

    createPlaylist(text, value) {
        const html = `<option value="${value}">${text}</option>`;
        document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
    },

    // need method to create a track list group item 
    createTrack(id, name) {
        const html = `<a href="#" class="list-display" id="${id}">${name}\n</a>`;
        document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
    },

    // need method to create the song detail
    createTrackDetail(img, title, artist) {

        const detailDiv = document.querySelector(DOMElements.divSongDetail);
        // any time user clicks a new song, we need to clear out the song detail div
        detailDiv.innerHTML = '';

        const html = 
        `
        <div class="image">
            <img src="${img}" alt="">        
        </div>
        <div class="row">
            <label for="Genre">${title}:</label>
        </div>
        <div class="artist">
            <label for="artist">By ${artist}:</label>
        </div> 
        `;

        detailDiv.insertAdjacentHTML('beforeend', html)
    },

    resetTrackDetail() {
        this.inputField().songDetail.innerHTML = '';
    },

    resetTracks() {
        this.inputField().tracks.innerHTML = '';
        this.resetTrackDetail();
    },

    resetPlaylist() {
        this.inputField().playlist.innerHTML = '';
        this.resetTracks();
    },
    
    storeToken(value) {
        document.querySelector(DOMElements.hfToken).value = value;
    },

    getStoredToken() {
        return {
            token: document.querySelector(DOMElements.hfToken).value
        }
    }
}