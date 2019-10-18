import      Channel from "./channel.js";
import * as Config  from "../../config.js";
import      Lang    from "../lib/lang.js";

export default class PiTube {
    constructor(options) {
        let ids = Config.IDS,
            lang = localStorage.getItem("pitube.lang");

        this.$container = document.querySelector(options.el);

        this._hasLoaded = false;
        this._filtered = false;

        this.channels = ids.map(id => new Channel(id));

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
            todayCount += channel.countVideos(video => video.isToday);
        });

        this.$el.classList.toggle("empty", todayCount === 0 && this._filtered);
    }

    filterRecent() {
        let recentCount = 0;

        this._filtered = !this._filtered;

        this.channels.forEach(channel => {
            channel.filterRecent();
            recentCount += channel.countVideos(video => video.isRecent);
        });

        this.$el.classList.toggle("empty", recentCount === 0 && this._filtered);
    }

    renderFilterIcons() {
        let $filterIcons = document.createElement("span");
        $filterIcons.classList.add("filter-icons");

        let $filterTodayIcon = document.createElement("span");

        $filterTodayIcon.classList.add("fa", "fa-calendar", "filter-icon");
        $filterTodayIcon.setAttribute("title", Lang.get("filter_today_title"));
        $filterTodayIcon.addEventListener("click", () => this.filterToday());

        $filterIcons.appendChild($filterTodayIcon);

        let $filterRecentIcon = document.createElement("span");

        $filterRecentIcon.classList.add("fa", "fa-clock-o", "filter-icon");
        $filterRecentIcon.setAttribute("title", Lang.get("filter_recent_title"));
        $filterRecentIcon.addEventListener("click", () => this.filterRecent());

        $filterIcons.appendChild($filterRecentIcon);

        document.getElementById("header").appendChild($filterIcons);
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
        if (!this.$el) {
            this.$el = document.createElement("div");
            this.$el.classList.add("pitube");
            this.$container.appendChild(this.$el);
        }

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
            this.renderFilterIcons();

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
