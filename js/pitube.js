import * as DateHelper     from "./dateHelper.js";
import * as DurationHelper from "./durationHelper.js";
import * as HTTP           from "./http.js";

const YOUTUBE_URL = "https://www.youtube.com/";

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

        return HTTP.request("/channels", options)
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

        return HTTP.request("/search", options)
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

        this.$el.innerHTML =
            `<img class="channel-avatar" src="${this.avatarUrl}"/>` +
            `<span class="channel-title">${this.title}</span>` +
            `<span class="youtube-icon fa fa-youtube"` +
                   `title="Visit ${this.username} on YouTube"` +
                   `onclick=window.open("${YOUTUBE_URL}user/${this.username}/videos")>` +
            `</span>`;

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

        return HTTP.request("/videos", options)
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

        $video.innerHTML +=
            `<img class="video-thumbnail" src="${this.thumbnailUrl}"/>` +
            `<div class="video-title">${this.title}</div>` +
            `<span class="video-info">` +
                `<span class="icon-calendar fa fa-calendar"></span>` +
                `${DateHelper.formatDate(this.publishedAt)}, ` +
                DateHelper.formatTime(this.publishedAt) +
            `</span>` +
            `<span class="video-duration">` +
                `<span class="icon-clock fa fa-clock-o"></span>` +
                DurationHelper.format(this.duration) +
            `</span>`;

        return $video;
    }
}

let channels = new ChannelCollection(USERNAMES);

channels.loadChannels().then(channels.render.bind(channels));
