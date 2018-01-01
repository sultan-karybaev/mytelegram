var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get("/get", function (req, res, next) {
  //console.log(req);
  console.log("DEST");
  res.send({word: "Cool!"});
});

var server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

var io = require("socket.io")();
io.attach(server);
//var socketEvents = require("./server/socket");

function socketEvents(io) {
  io.sockets.on("connection", function (socket) {
    console.log("SOCKETS ");

    socket.on("titanic", function (data) {
      console.log("Titanic");
      //console.log(socket);
      socket.emit("titanic");
      socket.broadcast.emit("titanic");
      console.log(data);
    });

    socket.on("setMessageServer", function (data) {
      console.log("setMessageServer");
      console.log(data);
      //socket.emit("titanic");
      //socket.broadcast.emit("titanic");
      socket.emit("setMessageSocket", data);
      socket.broadcast.emit("setMessageSocket", data);
      socket.emit("newLastMessageSocket", data);
      socket.broadcast.emit("newLastMessageSocket", data);
    });
  });
}

socketEvents(io);
