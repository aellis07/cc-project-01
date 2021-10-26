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
}
