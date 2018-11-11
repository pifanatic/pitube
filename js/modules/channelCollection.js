import Channel from "./channel.js";

export default class ChannelCollection {
    constructor(usernames) {
        this.channels = usernames.map(username => new Channel(username));
    }

    loadChannels() {
        return Promise.all(this.channels.map(channel => channel.load()));
    }

    render() {
        this.$el = document.createElement("div");

        this.channels.forEach(channel => {
            this.$el.appendChild(channel.render());

            channel.renderVideos();
        });

        return this.$el;
    }
}
