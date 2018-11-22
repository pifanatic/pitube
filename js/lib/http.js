/**
    Do a HTTP GET request to a given url.

    @param url The URL for the GET request
    @param options Optional Object that contains the URL parameters for the
        request as key values. Values implicitly be URI-encoded

    @returns A Promise returned by the Fetch API

    Example:

       get("https://www.example.com", { bob: "alice?", foo: "bar/" })

       => GET https://www.example.com?bob=alice%3F&foo=bar%2F
*/
export function get(url, options) {
    let params = Object.keys(options)
                       .map(key => `${key}=${encodeURIComponent(options[key])}`)
                       .join("&");

    return fetch(`${url}?${params}`);
};
