const express = require("express");
const app = express();
const fs = require("fs");

const servePage = function (req, res) {
  res.sendFile(__dirname + "/index.html");
}
app.get("/", servePage);
app.get("/filename/:filename", servePage);

app.get("/scripts/:filename", function (req, res) {
  const filename = req.params.filename;
  res.sendFile(__dirname + "/scripts/" + filename);
});

app.get("/filelist", function (req, res) {
  const files = fs.readdirSync(__dirname + "/video").map((file) => file.replace(".mp4", ""));
  res.json(files);
});

const videoHandler = function (req, res) {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  const videoName = req.params.videoName || "PXL_20221031_142453048";
  const videoPath = `video/${videoName}.mp4`;
  console.log(videoPath);

  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
};

app.get("/video/:videoName", videoHandler);
app.get("/video", videoHandler);

app.listen(8000, function () {
  console.log("Listening on port 8000!");
});
