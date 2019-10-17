module.exports = function(grunt) {
    grunt.config.merge({
        chokidar: {
            options: {
                atBegin: true
            },
            files: [
                "js/**/*.js",
                "css/*.scss",
                "index.html",
                "config.js"
            ],
            tasks: ["devel"]
        }
    });

    grunt.loadNpmTasks("grunt-chokidar");
}
