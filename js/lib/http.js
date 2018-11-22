const API_URL = "https://www.googleapis.com/youtube/v3";

const DEFAULT_PARAMS = {
    part: "snippet",
    key: API_KEY,
};

export function get(endpoint, options) {
    options = Object.assign(DEFAULT_PARAMS, options || {});

    let params = Object.keys(options)
                       .map(key => `${key}=${encodeURIComponent(options[key])}`)
                       .join("&");

    return fetch(`${API_URL}${endpoint}?${params}`);
};
