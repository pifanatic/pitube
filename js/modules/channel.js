import * as HTTP    from "../lib/http.js";
import * as YouTube from "../lib/youtube.js";
import      Video   from "./video.js";

const YOUTUBE_URL = "https://www.youtube.com/";

export default class Channel {
    constructor(username) {
        this.username = username;
        this.videos = [];
    }

    load() {
        return YouTube.getChannel(this.username)
                      .then(data => {
                          this.id        = data.id;
                          this.title     = data.title;
                          this.avatarUrl = data.avatarUrl;
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
