var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
let multer = require("multer");
let fs = require('fs');
let mongoose = require("mongoose");

multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});

let upload = multer({dest: "static/media"});

let app = express();

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get("/mars", function (req, res, next) {
  //console.log(req);
  console.log("MARS");
  //res.send({word: "Cool!"});
});

app.post("/post/audio", upload.single("audiofile"), function (req, res, next) {
  console.log("AUDIO");
  console.log(req.file);
  res.send("Yahoo");
});

var server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

//console.log(server);

var io = require("socket.io")();
io.attach(server);
//var socketEvents = require("./server/socket");

function socketEvents(io) {
  io.sockets.on("connection", (socket) => {
    console.log("SOCKETS");

    socket.on("login-Login.vue-Server", function (userID) {
      console.log("login-Login.vue-Server");
      console.log(userID);
      socket.join(userID);
    });

    socket.on("logout-???-Server", function (data) {
      console.log("logout-???-Server");
      console.log(data);
    });

    socket.on("createNewRoom-Chat.vue-Server", function (data) {
      console.log("createNewRoom-Chat.vue-Server");
      console.log(data);
      socket.to(data.userID).emit("createNewRoomSocket", data.ME);
    });

    socket.on("enterRoom-ChatSidebar.vue-Server", function (data) {
      console.log("enterRoom-ChatSidebar.vue-Server");
      console.log(data);
      socket.join(data.roomID);
      // socket.emit("setMessageSocket", message1);
      // socket.to(data.roomID).emit("setMessageSocket", message2);
    });

    socket.on("setMessage-ChatSidebarContact.vue-Server", function (data) {
      console.log("setMessage-ChatSidebarContact.vue-Server");
      console.log(data);
      socket.emit("setMessageSocket", data);
      socket.to(data.roomID).emit("setMessageSocket", data);
      socket.emit("newLastMessageChatSidebarSocket", data);
      socket.broadcast.emit("newLastMessageChatSidebarSocket", data);
    });

    socket.on("audioFile-ChatSidebarContact.vue-Server", function (data, message) {
      console.log("audioFile-ChatSidebarContact.vue-Server");
      console.log(data);
      console.log(message);
      let lastMessage = {
        roomID: message.roomID,
        text: "Audio File",
        time: message.time,
      };
      let name = Math.floor(Math.random() * 1000000);
      message.src = "../../static/media/" + name + ".wav";
      fs.writeFile(__dirname + "/static/media/" + name + ".wav", data,  "binary", function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("The file was saved!");
          socket.emit("setMessageSocket", message);
          socket.broadcast.emit("setMessageSocket", message);
          socket.emit("newLastMessageChatSidebarSocket", lastMessage);
          socket.broadcast.emit("newLastMessageChatSidebarSocket", lastMessage);
        }
      });
    });
  });
}

socketEvents(io);
