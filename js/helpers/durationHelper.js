/*
    Takes a duration string as it has been returned by Youtube API and format
    it into better readable format: PT52M3S -> 52:03
*/
export function format(durationString) {
    let result  = "",
        hours   = _getDurationPart(durationString, /(\d*)H/),
        minutes = _getDurationPart(durationString, /(\d*)M/, "00"),
        seconds = _getDurationPart(durationString, /(\d*)S/, "00");

    if (hours) {
        result += `${hours}:`;
    }

    result += `${minutes}:${seconds}`;

    return result;
};

function _getDurationPart(durationString, regex, defaultValue) {
    if (regex.test(durationString)) {
        let time = regex.exec(durationString)[1];
        return time < 10 ? `0${time}` : time;
    } else {
        return defaultValue || "";
    }
}
