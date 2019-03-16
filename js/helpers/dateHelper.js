import Lang from "../lib/lang.js";

export function isToday(date) {
    let today = new Date();

    return today.getDate()  === date.getDate()  &&
           today.getMonth() === date.getMonth() &&
           today.getYear()  === date.getYear();
};

export function isYesterday(date) {
    let dateToCheck = new Date(date);

    dateToCheck.setDate(dateToCheck.getDate() + 1); // add one day

    return this.isToday(dateToCheck);
};

export function formatDate(date) {
    if (this.isToday(date)) {
        return Lang.get("common_today");
    } else if (this.isYesterday(date)) {
        return Lang.get("common_yesterday");
    }
    return date.toLocaleString(Lang.getLang(), { weekday: "short", day: "2-digit", month: "short" });
};

export function formatTime(date) {
    return date.toLocaleString(Lang.getLang(), { minute: "2-digit", hour: "2-digit" });
};
