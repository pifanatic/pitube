import      Channel from "./channel.js";
import * as Config  from "../config.js";

export default class PiTube {
    constructor() {
        let usernames = Config.USERNAMES;

        this.channels = usernames.map(username => new Channel(username));
    }

    load() {
        return Promise.all(this.channels.map(channel => channel.load()));
    }

    filterToday() {
        this.channels.forEach(channel => channel.filterToday());
    }

    renderFilterButton() {
        let $button = document.createElement("button");

        $button.classList.add("filter");
        $button.innerText = "Filter today";
        $button.addEventListener("click", () => this.filterToday());

        document.getElementsByClassName("header")[0].appendChild($button);
    }

    render() {
        this.renderFilterButton();

        this.$el = document.createElement("div");

        this.channels.forEach(channel => {
            this.$el.appendChild(channel.render());

            channel.renderVideos();
        });

        return this.$el;
    }
}
