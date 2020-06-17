const express = require("express");
const bodyParser = require("body-parser");
const save = require("instagram-save");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let filesTobeRemoved = [];

app.get("/", (req, res) => {
  filesTobeRemoved.forEach((e) => {
    fs.unlink(e, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`successfully deleted file ${filesTobeRemoved}`);
      }
    });
  });
  res.render("home", { hasVideo: false });
});

app.post("/videolink", (req, res) => {
  const url = req.body.link;
  const dir = "files/data";
  const splitted_url = url.split("/");
  const urlId = splitted_url[splitted_url.length - 2];
  save(urlId, dir).then((video) => {
    filesTobeRemoved.push(video.file);
    let reformedUrl = video.file.split("/").slice(1).join("/");
    // dArry = [true, "data", video.file, ".mp4"];
    res.render("home", {
      hasVideo: true,
      urlArry: reformedUrl,
    });
  });
});

app.listen(3000, () => {
  console.log("server got started");
});
