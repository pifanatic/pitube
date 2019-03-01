const sass = require("node-sass");

module.exports = function(grunt) {
    grunt.config.merge({
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

    grunt.loadNpmTasks('grunt-sass');
}
