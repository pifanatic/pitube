import * as YouTube from "../lib/youtube.js";
import      Video   from "./video.js";
import      Lang    from "../lib/lang.js";

export default class Channel {
    constructor(id) {
        this.id = id;
        this.videos = [];
        this.hidden = false;

        this.$el = document.createElement("div");
    }

    load() {
        return YouTube.getChannel(this.id)
                      .then(data => {
                          Object.assign(this, data);
                          return YouTube.searchVideos(this.id);
                      })
                      .then(videos => {
                          Object.assign(this.videos, videos);
                          this.loadVideos();
                      });
    }

    loadVideos() {
        let promises = [];

        this.videos.forEach(video => {
            promises.push(video.load());
        });

        return Promise.all(promises);
    }

    /**
     * Count the number of videos in this channel that match a predicate function
     *
     * @param {Function} fn A function that takes a video as its sole parameter
     * and returns a Boolean value
     *
     * @returns {Number} the number of videos that pass the predicate function
     */
    countVideos(fn) {
        let count = 0;

        this.videos.forEach(video => {
            count += fn(video) ? 1 : 0;
        });

        return count;
    }

    /**
     * Adds class "hidden" to all videos that have not been published today
     */
    filterToday() {
        this.hidden = this.countVideos(video => video.isToday) === 0 && !this.hidden;
        this.$el.classList.toggle("hidden", this.hidden);

        this.videos.forEach(video => video.toggleIsToday());
    }

    /**
     * Adds class "hidden" to all videos that have not been published within the
     * last 24 hours
     */
    filterRecent() {
        this.hidden = this.countVideos(video => video.isRecent) === 0 && !this.hidden;
        this.$el.classList.toggle("hidden", this.hidden);

        this.videos.forEach(video => video.toggleIsRecent());
    }

    render() {
        this.$el.classList.add("channel");
        this.$el.setAttribute("id", this.username);

        this.$el.innerHTML =
            `<div class="channel-header">
                <img class="channel-avatar" src="${this.avatarUrl}"/>
                <span class="channel-title">${this.title}</span>

                <a href="${YouTube.getChannelUrl(this.username)}" target="_blank" rel="noreferrer">
                    <span class="youtube-icon fa fa-youtube"
                        title="${Lang.get("channel_visit", this.username)}"
                    </span>
                </a>

                <span class="icon-arrow fa fa-chevron-down"
                    onclick="getElementById('${this.username}').classList.toggle('collapsed')"
                    title="${Lang.get("channel_toggle_visibility")}">
                </span>
             </div>`;

        let $videos = document.createElement("div");
        $videos.classList.add("videos");

        this.$el.appendChild($videos);

        this.videos.forEach(video => {
            $videos.appendChild(video.render());
        });

        return this.$el;
    }
}
