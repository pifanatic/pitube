import      Channel from "./channel.js";
import * as Config  from "../config.js";

export default class PiTube {
    constructor(options) {
        let $container = document.querySelector(options.el);

        this.$el = document.createElement("div");
        this.$el.classList.add("pitube");
        $container.appendChild(this.$el);

        this._hasLoaded = false;
        this._filtered = false;

        let usernames = Config.USERNAMES;
        this.channels = usernames.map(username => new Channel(username));
    }

    load() {
        return Promise.all(this.channels.map(channel => channel.load()))
                      .then(() => {
                          this._hasLoaded = true;
                          this.render();
                      });
    }

    filterToday() {
        let todayCount = 0;

        this._filtered = !this._filtered;

        this.channels.forEach(channel => {
            channel.filterToday();
            todayCount += channel.todayCount();
        });

        this.$el.classList.toggle("empty", todayCount === 0 && this._filtered);
    }

    renderFilterIcon() {
        let $filterIcon = document.createElement("span");

        $filterIcon.classList.add("fa", "fa-calendar", "filter");
        $filterIcon.setAttribute("title", "Show only today's videos");
        $filterIcon.addEventListener("click", () => this.filterToday());

        document.getElementById("header").appendChild($filterIcon);
    }

    render() {
        this.$el.innerHTML = `
            <div id="header" class="header">
                <span class="title-icon fa fa-youtube-play"></span>
                <span class="title">PiTube</span>
            </div>
            <div class="empty-message">
                <span>
                    No videos were published today!<br>
                    <span class="fa fa-frown-o sad-face"></span>
                </span>
            </div>
        `;

        if (this._hasLoaded) {
            this.renderFilterIcon();

            let $channelsEl = document.createElement("div");
            $channelsEl.classList.add("channels");

            this.channels.forEach(channel => {
                $channelsEl.appendChild(channel.render());

                channel.renderVideos();
            });

            this.$el.appendChild($channelsEl);
        } else {
            this.$el.innerHTML +=
                `<div class="loading-wrapper">
                    <span class="fa fa-spinner fa-spin"></span>
                 </div>`;
        }

        return this;
    }
}
