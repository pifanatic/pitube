module.exports = function(grunt) {
    grunt.registerTask("clean", function() {
        if (grunt.file.exists("dist/")) {
            grunt.file.delete("dist/");
        };
    });
}
