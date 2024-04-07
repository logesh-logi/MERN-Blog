const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/User");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Post = require("./model/Post");

const app = express();
require("dotenv").config();

//connecting to mongodb

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("db connected");
  app.listen(5500, () => {
    console.log("server listening");
  });
});

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

const salt = bcrypt.genSaltSync(10);
const secretKey = process.env.SCERET_KEY;

//Routes
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists" });
  }
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign(
      { username, id: userDoc._id },
      secretKey,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          id: userDoc._id,
          username,
          token,
        });
      }
    );
  } else {
    res.status(400).json("Invalid Credentials");
  }
});

app.get("/profile", (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    jwt.verify(token, secretKey, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } catch {
    res.status(400).json("Invalid token");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", upload.single("file"), async (req, res) => {
  const { title, summary, content } = req.body;
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  const token = req.headers["x-access-token"];
  try {
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (e) {
    res.json(e);
  }
  // res.json({ token });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const PostDoc = await Post.findById(id).populate("author", ["username"]);
    res.json(PostDoc);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.put("/post", upload.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const token = req.headers["x-access-token"];
  jwt.verify(token, secretKey, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("You are not the author");
    }
    const filter = { _id: postDoc._id };
    await Post.updateOne(filter, {
      title,
      content,
      summary,
      cover: newPath ? newPath : postDoc.cover,
    });
    res.json("Post updated ");
  });
});
