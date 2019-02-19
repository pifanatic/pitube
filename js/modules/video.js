import * as YouTube        from "../lib/youtube.js";
import * as DateHelper     from "../helpers/dateHelper.js";
import * as DurationHelper from "../helpers/durationHelper.js";

export default class Video {
    constructor(videoId) {
        this.id = videoId;

        this._hasLoaded = false;

        this.$el = document.createElement("div");
        this.$el.classList.add("video");

        this.$el.addEventListener("click", () => {
            window.open(YouTube.getWatchUrl(this.id));
        });
    }

    load() {
        return YouTube.getVideo(this.id)
                      .then(data => {
                          Object.assign(this, data);
                          this.today = DateHelper.isToday(this.publishedAt);
                          this.loadThumbnail();
                      });
    }

    loadThumbnail() {
        let img = new Image();
        img.src = this.thumbnailUrl;
        img.classList.add("video-thumbnail");

        img.onload = function() {
            this._hasLoaded = true;
            this.render();
        }.bind(this);

        this.img = img;
    }

    toggleToday() {
        this.hidden = !this.today && !this.hidden;

        this.$el.classList.toggle("hidden", this.hidden);
    }

    render() {
        if (this._hasLoaded) {
            this.$el.classList.toggle("today", this.today);

            this.$el.innerHTML =
                `${this.img.outerHTML}
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
        } else {
            this.$el.innerHTML =
                `<div class="loading-wrapper">
                    <span class="fa fa-spinner fa-spin"></span>
                 </div>`;
        }

        return this.$el;
    };
}
