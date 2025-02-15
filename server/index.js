const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http").createServer(app);
const PORT = process.env.PORT || 4000;
const multer = require("multer");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const helmet = require("helmet");
const authRouter = require("./routers/authRouter");
const apiRouter = require("./routers/apiRouter");
const messageRouter = require("./routers/messageRouter");
const { sessionMiddleware, wrap } = require("./controllers/serverController");
const {
  dm,
  authorizeUser,
  initializeUser,
  addFriend,
  onDisconnect,
  createGroup,
  clearUnread,
} = require("./controllers/socketController");

// mongoose = require("mongoose");
// conn_uri =
//   "mongodb+srv://Maxhu787:or790aEb4HGfRIoL@cluster0.c8as3vd.mongodb.net/messages?retryWrites=true&w=majority";

// mongoose
//   .connect(conn_uri)
//   .then(() => {
//     console.log("Connected To database :)");
//   })
//   .catch((err) => console.log("error", err));

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);
app.use("/api", apiRouter);
app.use("/mongo", messageRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);

  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });

  socket.on("dm", (message) => dm(socket, message));

  socket.on("clear_unread", (id) => clearUnread(socket, id));

  socket.on("fetch_data", () => {
    initializeUser(socket);
  });

  socket.on("create_group", (groupMembers, cb) => {
    createGroup(socket, groupMembers, cb);
  });

  socket.on("disconnecting", () => {
    onDisconnect(socket);
    console.log("A user disconnected");
  });
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minute window
  max: 20, // limit each IP to 20 requests per windowMs (10 minutes),
  expire: 1000 * 60 * 60, // 60 miuntes
  message: "Rate limit exceeded (20 images per 10 minutes)",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./server/image-upload");
  },
  filename: (req, file, cb) => {
    // const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
    return fileName;
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: 1024 * 1024 * 5 }
});

app.get("/image/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(filename, { root: "./server/image-upload" }, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("File not found");
      // res.redirect("https://http.cat/404");
    }
  });
});

app.post("/image", limiter, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }
  let filename = req.file.filename;
  const url = `http://localhost:${PORT}/image/`;
  filename = url.concat(filename);

  data = {
    filename,
  };
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 3));
});

app.use(express.static(path.join(__dirname, "build")));
app.get("/", (req, res) => {
  res.json("hi");
  // res.sendFile(path.join(__dirname, "build", "index.html"));
});

http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
