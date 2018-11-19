import * as HTTP           from "../lib/http.js";
import * as DateHelper     from "../helpers/dateHelper.js";
import * as DurationHelper from "../helpers/durationHelper.js";

const YOUTUBE_URL = "https://www.youtube.com/";

export default class Video {
    constructor(videoId) {
        this.id = videoId;
    };

    load() {
        let options = {
            id: this.id,
            maxResults: 1,
            part: "snippet,contentDetails",
            fields: "items(contentDetails%2Fduration%2Csnippet(publishedAt%2Cthumbnails%2Fmedium%2Furl%2Ctitle))"
        };

        return HTTP.request("/videos", options)
            .then(res => res.json())
            .then(data => {
                data = data.items[0];

                this.publishedAt  = new Date(data.snippet.publishedAt);
                this.thumbnailUrl = data.snippet.thumbnails.medium.url;
                this.duration     = data.contentDetails.duration;
                this.title        = data.snippet.title;

                return this;
        });
    };

    render() {
        this.$el = document.createElement("div");
        this.$el.classList.add("video");

        this.$el.addEventListener("click", () => {
            window.open(`${YOUTUBE_URL}watch?v=${this.id}`)
        });

        this.$el.innerHTML =
            `<img class="video-thumbnail" src="${this.thumbnailUrl}"/>
             <div class="video-title">${this.title}</div>
             <span class="video-info">
                <span class="icon-calendar fa fa-calendar"></span>
                ${DateHelper.formatDate(this.publishedAt)},
                ${DateHelper.formatTime(this.publishedAt)}
             </span>
             <span class="video-duration">
                <span class="icon-clock fa fa-clock-o"></span>
                ${DurationHelper.format(this.duration)}
             </span>`;

        return this.$el;
    };
}
