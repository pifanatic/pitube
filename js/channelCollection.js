import Channel from "./channel.js";

export default class ChannelCollection {
    constructor(usernames) {
        this.channels = usernames.map(username => new Channel(username));
    }

    loadChannels() {
        return Promise.all(this.channels.map(channel => channel.load()));
    }

    render() {
        var $content = document.getElementById("content");

        this.channels.forEach(channel => {
            $content.appendChild(channel.render());

            channel.renderVideos();
        });
    }
}
