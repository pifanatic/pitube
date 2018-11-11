import * as DateHelper        from "./helpers/dateHelper.js";
import * as DurationHelper    from "./helpers/durationHelper.js";
import * as HTTP              from "./lib/http.js";
import      Video             from "./video.js";
import      Channel           from "./channel.js";
import      ChannelCollection from "./channelCollection.js";

let channels = new ChannelCollection(USERNAMES);

channels.loadChannels().then(() => {
    let $content = document.getElementById("content");
    $content.appendChild(channels.render());
});
