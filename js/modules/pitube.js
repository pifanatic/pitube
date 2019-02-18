import      Channel from "./channel.js";
import * as Config  from "../config.js";

export default class PiTube {
    constructor(options) {
        this.$el = document.querySelector(options.el);

        let usernames = Config.USERNAMES;
        this.channels = usernames.map(username => new Channel(username));
    }

    load() {
        return Promise.all(this.channels.map(channel => channel.load()));
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
        this.renderFilterIcon();

        this.channels.forEach(channel => {
            this.$el.appendChild(channel.render());

            channel.renderVideos();
        });

        return this.$el;
    }
}
