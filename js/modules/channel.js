import * as HTTP  from "../lib/http.js";
import      Video from "./video.js";

const YOUTUBE_URL = "https://www.youtube.com/";

export default class Channel {
    constructor(username) {
        this.username = username;
        this.videos = [];
    }

    load() {
        let options = {
            forUsername: this.username,
            maxResults: 1,
            fields: "items(id%2Csnippet(thumbnails%2Fdefault%2Furl%2Ctitle))"
        }

        return HTTP.request("/channels", options)
            .then(res => res.json())
            .then(data => {
                data = data.items[0];

                this.id        = data.id;
                this.title     = data.snippet.title;
                this.avatarUrl = data.snippet.thumbnails.default.url;
            })
            .then(this.getVideos.bind(this))
            .then(this.loadVideos.bind(this));
    }

    getVideos() {
        let options = {
            maxResults: 12,
            order: "date",
            type: "video",
            fields: "items(id%2FvideoId)",
            channelId: this.id
        };

        return HTTP.request("/search", options)
            .then(res => res.json())
            .then(data => {
                data.items.forEach(item => {
                    this.videos.push(new Video(item.id.videoId));
                });
            });
    }

    loadVideos() {
        let promises = [];

        this.videos.forEach(video => {
            promises.push(video.load());
        });

        return Promise.all(promises);
    }

    render() {
        this.$el = document.createElement("div");
        this.$el.classList.add("channel")

        this.$el.innerHTML =
            `<img class="channel-avatar" src="${this.avatarUrl}"/>
             <span class="channel-title">${this.title}</span>
             <span class="youtube-icon fa fa-youtube"
                   title="Visit ${this.username} on YouTube"
                   onclick=window.open("${YOUTUBE_URL}user/${this.username}/videos")>
             </span>`;

        return this.$el;
    }

    renderVideos() {
        let $videos = document.createElement("div");
        $videos.classList.add("videos");

        this.$el.parentNode.insertBefore($videos, this.$el.nextSibling);

        this.videos.forEach(video => {
            $videos.appendChild(video.render());
        });
    }
}
