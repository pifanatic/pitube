import * as HTTP from "./http.js";

/**
    Returns information about a YouTube channel.
    This information contains the following fields:

    - id
    - title
    - avatarUrl

    @param username The exact username of a YouTube channel

    @returns a Promise that resolves with an object containing information about
        a YouTube channel
*/
export function getChannel(username) {
    let options = {
        forUsername: username,
        maxResults: 1,
        fields: "items(id%2Csnippet(thumbnails%2Fdefault%2Furl%2Ctitle))"
    };

    return HTTP.request("/channels", options)
               .then(res => res.json())
               .then(data => {
                   data = data.items[0];

                   return {
                       id:        data.id,
                       title:     data.snippet.title,
                       avatarUrl: data.snippet.thumbnails.default.url
                   };
               }
    );
}
