export function get(url, options) {
    let params = Object.keys(options)
                       .map(key => `${key}=${encodeURIComponent(options[key])}`)
                       .join("&");

    return fetch(`${url}?${params}`);
};
