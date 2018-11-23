import * as YouTube from "../lib/youtube.js";
import      Video   from "./video.js";

export default class Channel {
    constructor(username) {
        this.username = username;
        this.videos = [];
    }

    load() {
        return YouTube.getChannel(this.username)
                      .then(data => {
                          Object.assign(this, data);
                          return YouTube.searchVideos(this.id);
                      })
                      .then(videos => {
                          Object.assign(this.videos, videos);
                          return this.loadVideos();
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
        this.$el.classList.add("channel");
        this.$el.setAttribute("id", this.username);

        this.$el.innerHTML =
            `<img class="channel-avatar" src="${this.avatarUrl}"/>
             <span class="channel-title">${this.title}</span>
             <span class="youtube-icon fa fa-youtube"
                   title="Visit ${this.username} on YouTube"
                   onclick=window.open("${YouTube.URL}user/${this.username}/videos")>
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
