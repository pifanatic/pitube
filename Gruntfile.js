module.exports = function(grunt) {

    if (!grunt.file.exists("config.js")) {
        grunt.fail.fatal(`No configuration file found!`);
    }

    grunt.loadTasks("./grunt/");

    grunt.registerTask("devel", ["copy", "sass:devel"]);
}
