module.exports = function(grunt) {
    grunt.config.merge({
        copy: {
            main: {
                files: [{
                    src: [
                        "index.html",
                        "favicon.ico",
                        "js/**",
                        "img/*",
                        "config.js"
                    ],
                    dest: "dist/"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
}
