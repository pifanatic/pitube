module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    src: [
                        "index.html",
                        "favicon.ico",
                        "js/**",
                        "css/**"
                    ],
                    dest: "dist/"
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("devel", ["copy"]);
}
