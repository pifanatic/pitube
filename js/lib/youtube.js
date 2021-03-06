import * as HTTP   from "./http.js";
import      Video  from "../modules/video.js";
import * as Config from "../../config.js";

export const URL = "https://www.youtube.com/";

const API_URL = Config.API_URL;

const DEFAULT_PARAMS = {
    part: "snippet",
    key: Config.API_KEY,
};

/**
    Middleware method to extend request with the default options
*/
function get(url, options) {
    return HTTP.get(url, Object.assign({}, DEFAULT_PARAMS, options));
}

/**
    Returns information about a YouTube channel.
    This information contains the following fields:

    - id
    - title
    - avatarUrl

    @param id The channel id of a YouTube channel

    @returns a Promise that resolves with an object containing information about
        a YouTube channel
*/
export function getChannel(id) {
    let options = {
        id: id,
        maxResults: 1,
        fields: "items(id,snippet(thumbnails/default/url,title))"
    };

    return get(`${API_URL}/channels`, options)
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
        fields: "items(contentDetails/duration,snippet(publishedAt,thumbnails/medium/url,title))"
    };

    return get(`${API_URL}/videos`, options)
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
        fields: "items(id/videoId)",
        channelId: channelId
    };

    return get(`${API_URL}/search`, options)
               .then(res => res.json())
               .then(data => data.items.map(item => new Video(item.id.videoId)));
}

/**
    Return the URL to the videos section of a YouTube channel

    @param id The id of the channel

    @returns the url to the channel's video section
*/
export function getChannelUrl(id) {
    return `${URL}channel/${id}/videos`;
}

/**
    Return the URL of a video

    @param videoId The id of the video

    @return the watch URL of the video
*/
export function getWatchUrl(videoId) {
    return `${URL}watch?v=${videoId}`;
}
