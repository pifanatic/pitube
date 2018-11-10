/*
Takes a duration string as it has been returned by Youtube API and format
it into better readable format: PT52M3S -> 52:03
*/
export function format(durationString) {
    /PT(\d*)H?(\d*)M?(\d*)S?/
        .exec(durationString)
        .splice(1)
        .filter(x => x) // remove undefined values
        .map(x => x < 10 ? `0${x}` : x) // add leading 0 if necessary
        .join(":")
};
