const API_URL     = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_URL = "https://www.youtube.com/";

const DEFAULT_PARAMS = {
    part: "snippet",
    key: API_KEY,
};

var DateHelper = {
    isToday(date) {
        let today = new Date()

        return today.getDate()  === date.getDate()  &&
               today.getMonth() === date.getMonth() &&
               today.getYear()  === date.getYear();
    },
    isYesterday(date) {
        var dateToCheck = new Date(date);

        dateToCheck.setDate(dateToCheck.getDate() + 1); // add one day

        return this.isToday(dateToCheck);
    },
    formatDate(date) {
        if (this.isToday(date)) {
            return "Today";
        } else if (this.isYesterday(date)) {
            return "Yesterday";
        }
        return date.toLocaleString("en", { weekday: "short", day: "2-digit", month: "short" });
    },
    formatTime(date) {
        return date.toLocaleString("en", { minute: "2-digit", hour: "2-digit" });
    }
};

var DurationHelper = {
    /*
        Takes a duration string as it has been returned by Youtube API and format
        it into better readable format: PT52M3S -> 52:03
    */
    format: durationString =>
        /PT(\d*)H?(\d*)M?(\d*)S?/
            .exec(durationString)
            .splice(1)
            .filter(x => x) // remove undefined values
            .map(x => x < 10 ? `0${x}` : x) // add leading 0 if necessary
            .join(":")
};

var ChannelCollection = function(usernames) {
    this.channels = usernames.map(username => new Channel(username));

    this.loadChannels = function() {
        return Promise.all(this.channels.map(channel => channel.load()));
    };

    this.render = function() {
        var $content = document.getElementById("content");

        this.channels.forEach(channel => {
            $content.appendChild(channel.render());

            channel.renderVideos();
        });
    };
}

var Channel = function(username) {
    this.username = username;
    this.videos = [];

    this.load = function() {
        let options = {
            forUsername: this.username,
            maxResults: 1,
            fields: "items(id%2Csnippet(thumbnails%2Fdefault%2Furl%2Ctitle))"
        }

        return request("/channels", options)
            .then(res => res.json())
            .then(data => {
                data = data.items[0];

                this.id        = data.id;
                this.title     = data.snippet.title;
                this.avatarUrl = data.snippet.thumbnails.default.url;
            })
            .then(this.getVideos.bind(this))
            .then(this.loadVideos.bind(this));
    };

    this.getVideos = function() {
        var options = {
            maxResults: 12,
            order: "date",
            type: "video",
            fields: "items(id%2FvideoId)",
            channelId: this.id
        };

        return request("/search", options)
            .then(res => res.json())
            .then(data => {
                data.items.forEach(item => {
                    this.videos.push(new Video(item.id.videoId));
                });
            });
    };

    this.loadVideos = function() {
        let promises = [];

        this.videos.forEach(video => {
            promises.push(video.load());
        });

        return Promise.all(promises);
    },

    this.render = function() {
        this.$el = document.createElement("div");
        this.$el.classList.add("channel")

        var $avatar = document.createElement("img");
        $avatar.setAttribute("src", this.avatarUrl);
        $avatar.classList.add("channel-avatar");

        var $title = document.createElement("span");
        $title.innerText = this.title;
        $title.classList.add("channel-title");

        var $icon = document.createElement("span");
        $icon.classList.add("youtube-icon", "fa", "fa-youtube");
        $icon.setAttribute("title", `Visit ${this.username} on YouTube`);

        $icon.addEventListener("click", () => {
            window.open(`${YOUTUBE_URL}user/${this.username}/videos`)
        });

        this.$el.appendChild($avatar);
        this.$el.appendChild($title);
        this.$el.appendChild($icon);

        return this.$el;
    };

    this.renderVideos = function() {
        var $videos = document.createElement("div");
        $videos.classList.add("videos");

        this.$el.parentNode.insertBefore($videos, this.$el.nextSibling);

        this.videos.forEach(video => {
            $videos.appendChild(video.render());
        });
    };
}

var Video = function(videoId) {
    this.id = videoId;

    this.load = function() {
        let options = {
            id: this.id,
            maxResults: 1,
            part: "snippet,contentDetails",
            fields: "items(contentDetails%2Fduration%2Csnippet(publishedAt%2Cthumbnails%2Fmedium%2Furl%2Ctitle))"
        }

        return request("/videos", options)
            .then(res => res.json())
            .then(data => {
                data = data.items[0];

                this.publishedAt  = new Date(data.snippet.publishedAt);
                this.thumbnailUrl = data.snippet.thumbnails.medium.url;
                this.duration     = data.contentDetails.duration;
                this.title        = data.snippet.title;

                return this;
        });
    }

    this.render = function() {
        var $video = document.createElement("div");
        $video.classList.add("video");
        $video.addEventListener("click", () => {
            window.open(`${YOUTUBE_URL}watch?v=${this.id}`)
        });

        var $thumb = document.createElement("img");
        $thumb.setAttribute("src", this.thumbnailUrl);
        $thumb.classList.add("video-thumbnail");
        $video.appendChild($thumb);

        var $title = document.createElement("div");
        $title.classList.add("video-title");
        $title.innerText = this.title;
        $video.appendChild($title);

        var $info = document.createElement("span");
        $info.classList.add("video-info");
        $info.innerText = DateHelper.formatDate(this.publishedAt) + ", " +
                          DateHelper.formatTime(this.publishedAt);
        $video.appendChild($info);

        var $duration = document.createElement("span");
        $duration.classList.add("video-duration");
        $duration.innerText = DurationHelper.format(this.duration);

        $video.appendChild($duration);

        return $video;
    }
}

function request(endpoint, options) {
    options = Object.assign(DEFAULT_PARAMS, options || {});

    let params = Object.keys(options)
                       .map(key => `${key}=${options[key]}`)
                       .join("&");

    return fetch(`${API_URL}${endpoint}?${params}`);
}

let channels = new ChannelCollection(USERNAMES);

channels.loadChannels().then(channels.render.bind(channels));
