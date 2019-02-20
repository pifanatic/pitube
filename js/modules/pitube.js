import      Channel from "./channel.js";
import * as Config  from "../config.js";

export default class PiTube {
    constructor(options) {
        let $container = document.querySelector(options.el);

        this.$el = document.createElement("div");
        this.$el.classList.add("pitube");
        $container.appendChild(this.$el);

        this._hasLoaded = false;

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
        this.channels.forEach(channel => channel.filterToday());
    }

    renderFilterIcon() {
        let $filterIcon = document.createElement("span");

        $filterIcon.classList.add("fa", "fa-calendar", "filter");
        $filterIcon.setAttribute("title", "Show only today's videos");
        $filterIcon.addEventListener("click", () => this.filterToday());

        document.getElementById("header").appendChild($filterIcon);
    }

    render() {
        this.$el.innerHTML = "";

        if (this._hasLoaded) {
            this.renderFilterIcon();

            this.channels.forEach(channel => {
                this.$el.appendChild(channel.render());

                channel.renderVideos();
            });
        } else {
            this.$el.innerHTML =
                `<div class="loading-wrapper">
                    <span class="fa fa-spinner fa-spin"></span>
                 </div>
                `
        }

        return this.$el;
    }
}
