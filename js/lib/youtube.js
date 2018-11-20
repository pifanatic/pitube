import * as HTTP  from "./http.js";
import      Video from "../modules/video.js";

export const URL = "https://www.youtube.com/";

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

/**
    Returns information about a YouTube video.
    This information contains the following fields:

    - title
    - publishedAt
    - duration
    - thumbnailUrl

    @param videoId The id of a YouTube video

    @returns a Promise that resolves with an object containing information about
             a YouTube video
*/
export function getVideo(videoId) {
    let options = {
        id: videoId,
        maxResults: 1,
        part: "snippet,contentDetails",
        fields: "items(contentDetails%2Fduration%2Csnippet(publishedAt%2Cthumbnails%2Fmedium%2Furl%2Ctitle))"
    };

    return HTTP.request("/videos", options)
               .then(res => res.json())
               .then(data => {
                   data = data.items[0];

                   return {
                       title:        data.snippet.title,
                       publishedAt:  new Date(data.snippet.publishedAt),
                       duration:     data.contentDetails.duration,
                       thumbnailUrl: data.snippet.thumbnails.medium.url
                   };
               }
    );
}

/**
    Search for for videos by a specific YouTube channel

    @param channelId the id of a YouTube channel

    @returns an array with the latest twelve videos by that channel
*/
export function searchVideos(channelId) {
    let options = {
        maxResults: 12,
        order: "date",
        type: "video",
        fields: "items(id%2FvideoId)",
        channelId: channelId
    };

    return HTTP.request("/search", options)
               .then(res => res.json())
               .then(data => data.items.map(item => new Video(item.id.videoId)));
}
