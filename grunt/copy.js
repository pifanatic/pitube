module.exports = function(grunt) {
    let destFolder = "dist/",
        commonSourceFiles = [
            "index.html",
            "favicon.ico",
            "js/**",
            "img/*",
            "config.js"
        ],
        develSourceFiles = [
            "develAssets/*"
        ];

    grunt.config.merge({
        copy: {
            devel: {
                files: [{
                    src: commonSourceFiles.concat(develSourceFiles),
                    dest: destFolder
                }]
            },
            prod: {
                files: [{
                    src: commonSourceFiles,
                    dest: destFolder
                }]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
}
