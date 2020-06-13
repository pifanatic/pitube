module.exports = function(grunt) {
    const files = {
        "dist/config.js": ["config.js"]
    };

    grunt.config.merge({
        template: {
            devel: {
                options: {
                    data: {
                        api_url: "http://localhost:8080/api"
                    }
                },
                files: files
            },
            prod: {
                options: {
                    data: {
                        api_url: "https://www.googleapis.com/youtube/v3"
                    }
                },
                files: files
            }
        }
    });

    grunt.loadNpmTasks("grunt-template");
}
