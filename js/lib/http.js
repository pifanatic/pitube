const DEFAULT_PARAMS = {
    part: "snippet",
    key: API_KEY,
};

export function get(url, options) {
    options = Object.assign(DEFAULT_PARAMS, options || {});

    let params = Object.keys(options)
                       .map(key => `${key}=${encodeURIComponent(options[key])}`)
                       .join("&");

    return fetch(`${url}?${params}`);
};
