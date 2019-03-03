module.exports = function(grunt) {

    let defaultTasks = ["clean", "copy"];

    if (!grunt.file.exists("config.js")) {
        grunt.fail.fatal(`No configuration file found!`);
    }

    grunt.loadTasks("./grunt/");

    grunt.registerTask("devel", defaultTasks.concat(["sass:devel"]));

    grunt.registerTask("prod", defaultTasks.concat(["sass:prod"]));

    grunt.registerTask("watch", ["chokidar"]);
}
