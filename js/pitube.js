import * as DateHelper        from "./dateHelper.js";
import * as DurationHelper    from "./durationHelper.js";
import * as HTTP              from "./http.js";
import      Video             from "./video.js";
import      Channel           from "./channel.js";
import      ChannelCollection from "./channelCollection.js";

let channels = new ChannelCollection(USERNAMES);

channels.loadChannels().then(channels.render.bind(channels));
