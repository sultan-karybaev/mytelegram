var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
let multer = require("multer");
let fs = require('fs');

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blablachat");

multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});

let upload = multer({dest: "static/media"});

let app = express();

const Profile = require("./server/models/Profile");
const Room = require("./server/models/Room");
const Message = require("./server/models/Message");
const RoomProfile = require("./server/models/roomProfile");

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Profile.find()
//   .exec(function (err, profiles) {
//     if (err) return console.log(err);
//     profiles.forEach(function (profile) {
//       profile.avatar = "src/assets/avatar.jpg";
//       profile.save(function (err) {
//         if (err) return console.log(err);
//         console.log("Done");
//       });
//     })
//   });

app.get("/mars", function (req, res, next) {
  console.log("MARS");
});

app.post("/post/profile", function (req, res) {
  let profile = new Profile({
    firstName: "Sultan",
    lastName: "Karybaev",
    phone: 87774921228,
    password: "sultan"
  });
  profile.save(function (err, savedProfile) {
    if (err) return res.sendStatus(400).end();
  });
});

app.post("/post/login", function (req, res) {
  Profile.findOne({phone: req.body.phone, password: req.body.password})
    .exec(function (err, profile) {
      if (err) return res.sendStatus(400).end();
      res.send(profile);
    });
});

app.get("/get/contacts/:profileID", function (req, res) {
  console.log(req.params.profileID);

  Profile.find({_id: { $ne: req.params.profileID}})
    .exec(function (err, profiles) {
      if (err) return console.log(err);
      res.send(profiles);
    });
});

app.get("/get/rooms/:profileID", function (req, res) {
  console.log("Rooms");
  console.log(req.params.profileID);
  //todo

  RoomProfile.find({profileID: req.params.profileID}).populate("roomID")
    .exec(function (err, roomProfiles) {
      if (err) return res.sendStatus(400).end();
      console.log(roomProfiles);
      let roomArray = [];
      let roomObj;
      // roomProfiles.forEach(function (roomProfile) {
      //   Room.findById(roomProfile.roomID)
      //     .exec(function (err, room) {
      //       if (err) return res.sendStatus(400).end();
      //       roomObj = {
      //         _id: roomProfile.roomID,
      //         unreadMessageCount: roomProfile.unreadMessageCount,
      //         index: roomProfile.index,
      //         name: roomProfile.name,
      //         img: roomProfile.img,
      //         typeRoom: room.typeRoom,
      //         lastMessageText: room.lastMessageText,
      //         lastMessageTime: room.lastMessageTime,
      //       };
      //       roomArray.push(roomObj);
      //     });
      // });
      console.log("roomArray", roomArray);
      res.send(roomArray);
    });
});

app.get("/get/roomExisting/:profileID/:contactID", function (req, res) {
  RoomProfile.find({profileID: req.params.contactID})
    .exec(function (err, roomProfiles1) {
      if (err) return res.sendStatus(400).end();
      if (roomProfiles1.length > 0) {
        roomProfiles1.forEach(function (roomProfile1) {
          RoomProfile.find({roomID: roomProfile1.roomID})
            .exec(function (err, roomProfiles2) {
              roomProfiles2.forEach(function (roomProfile2) {
                if (roomProfile2.profileID == req.params.profileID) res.send(roomProfile2.roomID);
              })
            });
        });
      }
      res.send(false);
    });
});

//test
app.post("/post/room/:profileID/:friendID", function (req, res) {
  //Request data = myProfileObject, friendID
  let roomObj;

  let room = new Room({
    typeRoom: "Standart",
    lastMessageText: "",
    lastMessageTime: "",
  });

  room.save(function (err, savedRoom) {
    if (err) return console.log(err);
    Profile.findById(req.params.friendID)
      .exec(function (err, friend) {
        if (err) return console.log(err);

        let roomProfile1 = new RoomProfile({
          roomID: savedRoom._id,
          profileID: myID,
          unreadMessageCount: 0,
          index: 0,
          name: friend.firstName + " " + friend.lastName,
          img: friend.avatar
        });

        let roomProfile2 = new RoomProfile({
          roomID: savedRoom._id,
          profileID: friend._id,
          unreadMessageCount: 0,
          index: 0,
          name: myfirstName + " " + mylastName,
          img: myavatar
        });

        roomProfile1.save(function (err, savedRoomProfile) {
          if (err) return console.log(err);
          RoomProfile.find({profileID: myID, })
            .exec(function (err, roomProfiles) {
              roomProfiles.forEach(function (roomProfile) {
                roomProfile.index++;
                roomProfile.save(function (err) {
                  if (err) return console.log(err);
                });
              });

              //socket emit
              roomObj = {
                _id: savedRoomProfile.roomID,
                unreadMessageCount: savedRoomProfile.unreadMessageCount,
                index: savedRoomProfile.index,
                name: savedRoomProfile.name,
                img: savedRoomProfile.img,
                typeRoom: savedRoom.typeRoom,
                lastMessageText: savedRoom.lastMessageText,
                lastMessageTime: savedRoom.lastMessageTime,
              };
            });
        });

        roomProfile2.save(function (err, savedRoomProfile) {
          if (err) return console.log(err);
          RoomProfile.find({profileID: friend._id, })
            .exec(function (err, roomProfiles) {
              roomProfiles.forEach(function (roomProfile) {
                roomProfile.index++;
                roomProfile.save(function (err) {
                  if (err) return console.log(err);
                });
              });

              //socket broadcast
              roomObj = {
                _id: savedRoomProfile.roomID,
                unreadMessageCount: savedRoomProfile.unreadMessageCount,
                index: savedRoomProfile.index,
                name: savedRoomProfile.name,
                img: savedRoomProfile.img,
                typeRoom: savedRoom.typeRoom,
                lastMessageText: savedRoom.lastMessageText,
                lastMessageTime: savedRoom.lastMessageTime,
              };
            });
        });


      });
  });
});

app.post("/post/audio", upload.single("audiofile"), function (req, res, next) {
  console.log("AUDIO");
  console.log(req.file);
  res.send("Yahoo");
});

const server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

const io = require("socket.io")();
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

    socket.on("createNewRoom-Chat.vue-Server", function (myself, contactID) {
      console.log("createNewRoom-Chat.vue-Server");
      console.log(myself);
      console.log(contactID);

      // Profile.findById(contactID)
      //   .exec(function (err, profile) {
      //     if (err) return console.log(err);
      //     console.log(profile);
      //   });

      let roomObj1;
      let roomObj2;

      let room = new Room({
        typeRoom: "Standart",
        lastMessageText: "",
        lastMessageTime: "",
      });

      room.save(function (err, savedRoom) {
        if (err) return console.log(err);
        Profile.findById(contactID)
          .exec(function (err, friend) {
            if (err) return console.log(err);

            let roomProfile1 = new RoomProfile({
              roomID: savedRoom._id,
              profileID: myself._id,
              unreadMessageCount: 0,
              index: 0,
              name: friend.firstName + " " + friend.lastName,
              img: friend.avatar
            });

            let roomProfile2 = new RoomProfile({
              roomID: savedRoom._id,
              profileID: friend._id,
              unreadMessageCount: 0,
              index: 0,
              name: myself.firstName + " " + myself.lastName,
              img: myself.avatar
            });

            roomProfile1.save(function (err, savedRoomProfile) {
              if (err) return console.log(err);
              RoomProfile.find({profileID: myself._id, })
                .exec(function (err, roomProfiles) {
                  roomProfiles.forEach(function (roomProfile) {
                    roomProfile.index++;
                    roomProfile.save(function (err) {
                      if (err) return console.log(err);
                    });
                  });

                  //socket emit
                  roomObj1 = {
                    _id: savedRoomProfile.roomID,
                    unreadMessageCount: savedRoomProfile.unreadMessageCount,
                    index: savedRoomProfile.index++,
                    name: savedRoomProfile.name,
                    img: savedRoomProfile.img,
                    typeRoom: savedRoom.typeRoom,
                    lastMessageText: savedRoom.lastMessageText,
                    lastMessageTime: savedRoom.lastMessageTime,
                  };

                  console.log("roomObj1", roomObj1);
                });
            });

            roomProfile2.save(function (err, savedRoomProfile) {
              if (err) return console.log(err);
              RoomProfile.find({profileID: friend._id, })
                .exec(function (err, roomProfiles) {
                  roomProfiles.forEach(function (roomProfile) {
                    roomProfile.index++;
                    roomProfile.save(function (err) {
                      if (err) return console.log(err);
                    });
                  });

                  //socket broadcast
                  roomObj2 = {
                    _id: savedRoomProfile.roomID,
                    unreadMessageCount: savedRoomProfile.unreadMessageCount,
                    index: savedRoomProfile.index++,
                    name: savedRoomProfile.name,
                    img: savedRoomProfile.img,
                    typeRoom: savedRoom.typeRoom,
                    lastMessageText: savedRoom.lastMessageText,
                    lastMessageTime: savedRoom.lastMessageTime,
                  };

                  console.log("roomObj2", roomObj2);
                });
            });


          });
      });

      // socket.emit("createNewRoomSocket", data.ME);
      // socket.to(data.userID).emit("createNewRoomSocket", data.ME);
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

    socket.on("image-ChatSidebarContact.vue-Server", function (data, img, message) {
      console.log("image");
      console.log(data);
      console.log(img);
      console.log(message);
      let lastMessage = {
        roomID: message.roomID,
        text: "Image",
        time: message.time,
      };
      message.text = "<img src=\"static/img/" + img.name + "\" style=\"width: 320px\"/>";
      fs.writeFile(__dirname + "/static/img/" + img.name, data,  "binary", function(err) {
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
