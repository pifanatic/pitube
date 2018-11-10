export function isToday(date) {
    let today = new Date();

    return today.getDate()  === date.getDate()  &&
           today.getMonth() === date.getMonth() &&
           today.getYear()  === date.getYear();
};

export function isYesterday(date) {
    var dateToCheck = new Date(date);

    dateToCheck.setDate(dateToCheck.getDate() + 1); // add one day

    return this.isToday(dateToCheck);
};

export function formatDate(date) {
    if (this.isToday(date)) {
        return "Today";
    } else if (this.isYesterday(date)) {
        return "Yesterday";
    }
    return date.toLocaleString("en", { weekday: "short", day: "2-digit", month: "short" });
};

export function formatTime(date) {
    return date.toLocaleString("en", { minute: "2-digit", hour: "2-digit" });
};
