import * as DateHelper     from "./dateHelper.js";
import * as DurationHelper from "./durationHelper.js";
import * as HTTP           from "./http.js";
import      Video          from "./video.js";
import      Channel        from "./channel.js";

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

let channels = new ChannelCollection(USERNAMES);

channels.loadChannels().then(channels.render.bind(channels));
