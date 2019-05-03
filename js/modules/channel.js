import * as YouTube from "../lib/youtube.js";
import      Video   from "./video.js";
import      Lang    from "../lib/lang.js";

export default class Channel {
    constructor(username) {
        this.username = username;
        this.videos = [];
        this.hidden = false;

        this.$el = document.createElement("div");
    }

    load() {
        return YouTube.getChannel(this.username)
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

    todayCount() {
        let count = 0;

        this.videos.forEach(video => {
            if (video.today) {
                count++;
            }
        });

        return count;
    }

    /**
     * Adds class "hidden" to all videos that have not been published today
     */
    filterToday() {
        this.toggleHidden();
        this.videos.forEach(video => video.toggleToday());
    }

    toggleHidden() {
        this.hidden = this.todayCount() === 0 && !this.hidden;
        this.$el.classList.toggle("hidden", this.hidden);
    }

    render() {
        this.$el.classList.add("channel");
        this.$el.setAttribute("id", this.username);

        this.$el.innerHTML =
            `<div class="channel-header">
                <img class="channel-avatar" src="${this.avatarUrl}"/>
                <span class="channel-title">${this.title}</span>
                <span class="youtube-icon fa fa-youtube"
                    title="${Lang.get("channel_visit", this.username)}"
                    onclick=window.open("${YouTube.getChannelUrl(this.username)}")>
                </span>
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
