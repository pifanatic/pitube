# Description

A simple webpage with an overview of the latest videos of your favorite YouTube channels

# How To Use

1. Install [nodeJS](https://nodejs.org/en/) incl. `npm`
2. Install all required dependencies using `npm install`
3. Visit Google's [Developer platform](https://developers.google.com) and get your API key for the Youtube API
4. Copy the `config.sample.js` file to `config.js` and fill in your API key and
   the names of your favorite YouTube channels
5. Build the project using either the `grunt devel` or `grunt prod` task
6. Serve the `dist/` directory with a web server of your choice
7. Profit

For further information about the Youtube API visit their official [documentation](https://developers.google.com/youtube/v3/).
