const express = require("express");

let server = express(),
    usedQuota = 0;

function updateQuota(points) {
    usedQuota += points;

    console.log(`Used quota: ${usedQuota}`);
}

server.use(express.static("dist"));

server.get("/api/channels", (req, res) => {
    updateQuota(3);

    res.json(
        {
            "items": [
                {
                    "id": req.query.id,
                    "snippet": {
                        "title": `channel_name`,
                        "thumbnails": {
                            "default": {
                                "url": `develAssets/channel_avatar.jpg`
                            }
                        }
                    }
                }
            ]
        }
    );
});

server.get("/api/search", (req, res) => {
    let items = [];

    for(let i = 0; i < req.query.maxResults; i++) {
        items.push({
            id: {
                videoId: `video_${i}`
            }
        });
    }

    updateQuota(100);

    res.json({ "items": items });
});

server.get("/api/videos", (req, res) => {
    updateQuota(4);

    res.json(
        {
            "items": [
                {
                    "snippet": {
                        "publishedAt": "2020-02-05T15:24:19Z",
                        "title": "test_video_title",
                        "thumbnails": {
                            "medium": {
                                "url": "develAssets/video.jpg"
                            }
                        }
                    },
                    "contentDetails": {
                        "duration": "PT12M45S"
                    }
                }
            ]
        }
    );
});

server.listen(8080);
