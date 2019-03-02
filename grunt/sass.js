const sass = require("node-sass");

module.exports = function(grunt) {
    let files = {
        "dist/css/default.css": "css/main.scss"
    }

    grunt.config.merge({
        sass: {
            options: {
                implementation: sass
            },
            devel: {
                files: files
            },
            prod: {
                files: files,
                options: {
                    outputStyle: "compressed"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
}
