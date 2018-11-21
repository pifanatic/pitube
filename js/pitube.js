import      ChannelCollection from "./modules/channelCollection.js";

let channels = new ChannelCollection(USERNAMES);

channels.loadChannels().then(() => {
    let $content = document.getElementById("content");
    $content.appendChild(channels.render());
});
