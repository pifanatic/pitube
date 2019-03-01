const sass = require("node-sass");

module.exports = function(grunt) {

    if (!grunt.file.exists("config.js")) {
        grunt.fail.fatal("No config.js found!");
    }

    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    src: [
                        "index.html",
                        "favicon.ico",
                        "js/**",
                        "config.js"
                    ],
                    dest: "dist/"
                }]
            }
        },
        sass: {
            options: {
                implementation: sass
            },
            devel: {
                files: {
                    "dist/css/default.css": "css/main.scss"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask("devel", ["copy", "sass:devel"]);
}
