const sass = require("node-sass");

module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    src: [
                        "index.html",
                        "favicon.ico",
                        "js/**"
                    ],
                    dest: "dist/"
                }]
            }
        },
        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    "dist/css/default.css": "css/main.scss"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-sass');

    grunt.registerTask("devel", ["copy", "sass"]);
}
