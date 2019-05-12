import      Channel from "./channel.js";
import * as Config  from "../../config.js";
import      Lang    from "../lib/lang.js";

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

        let lang = localStorage.getItem("pitube.lang");
        if (lang) {
            Lang.setLang(lang);
        }
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
        $filterIcon.setAttribute("title", Lang.get("filter_today_title"));
        $filterIcon.addEventListener("click", () => this.filterToday());

        document.getElementById("header").appendChild($filterIcon);
    }

    renderLangIcons() {
        let languages = Lang.getSupportedLanguages(),
            $el = document.createElement("span");

        $el.classList.add("lang-icons");

        languages.forEach(lang => {
            let $icon = document.createElement("img");
            $icon.setAttribute("src", `img/${lang}.png`);
            $icon.classList.toggle("active", Lang.getLang() === lang);

            $icon.addEventListener("click", () => {
                Lang.setLang(lang);
                localStorage.setItem("pitube.lang", lang);

                this.render();
            });
            $el.appendChild($icon);
        });

        document.getElementById("header").appendChild($el)
    }

    render() {
        this.$el.classList.toggle("loading", !this._hasLoaded);

        this.$el.innerHTML = `
            <div id="header" class="header">
                <span class="title-icon fa fa-youtube-play"></span>
                <span class="title">PiTube</span>
            </div>
            <div class="empty-message">
                <span>
                    ${Lang.get("no_videos_today")}<br>
                    <span class="fa fa-frown-o sad-face"></span>
                </span>
            </div>
            <div class="loading-wrapper">
                <span class="fa fa-spinner fa-spin"></span>
             </div>
        `;

        this.renderLangIcons();

        if (this._hasLoaded) {
            this.renderFilterIcon();

            let $channelsEl = document.createElement("div");
            $channelsEl.classList.add("channels");

            this.channels.forEach(channel => {
                $channelsEl.appendChild(channel.render());
            });

            this.$el.appendChild($channelsEl);
        }

        return this;
    }
}
