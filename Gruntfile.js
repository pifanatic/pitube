module.exports = function(grunt) {

    let defaultTasks = ["clean"];

    if (!grunt.file.exists("config.js")) {
        grunt.fail.fatal(`No configuration file found!`);
    }

    grunt.loadTasks("./grunt/");

    grunt.registerTask("devel", defaultTasks.concat(["copy:devel", "sass:devel", "template:devel"]));

    grunt.registerTask("prod", defaultTasks.concat(["copy:prod", "sass:prod", "template:prod"]));

    grunt.registerTask("watch", ["chokidar"]);
}
