import * as YouTube        from "../lib/youtube.js";
import * as DateHelper     from "../helpers/dateHelper.js";
import * as DurationHelper from "../helpers/durationHelper.js";

const YOUTUBE_URL = "https://www.youtube.com/";

export default class Video {
    constructor(videoId) {
        this.id = videoId;
    };

    load() {
        return YouTube.getVideo(this.id)
                      .then(data => Object.assign(this, data));
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
