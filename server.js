var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
let multer = require("multer");
let fs = require('fs');
let promiseBlueBird = require('bluebird');

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

// RoomProfile.find({profileID: "5a5843af9b3e7b16580924f0"})
//   .exec(function (err, roomProfiles1) {
//     if (err) return console.log(err);
//     console.log("roomProfiles1", roomProfiles1);
//
//     let array = [];
//     let bool = false;
//
//     for (let i = 0; i < roomProfiles1.length; i++) {
//       array.push(RoomProfile.find({roomID: roomProfiles1[i].roomID})
//         .exec(function (err, roomProfiles2) {
//           if (err) return console.log(err);
//           console.log("roomProfiles2", i, roomProfiles2);
//           for (let j = 0; j < roomProfiles2.length; j++) {
//
//             if (roomProfiles2[j].profileID == "5a5844c138605416fdd91ace") {
//               console.log("GOT IT");
//               bool = true;
//             }
//           }
//         }));
//     }
//
//     promiseBlueBird.all(array).then(function (arr) {
//       console.log("END", bool);
//     });
//   });

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

  RoomProfile.find({profileID: req.params.profileID}).populate("roomID")
    .exec(function (err, roomProfiles) {
      if (err) return res.sendStatus(400).end();
      console.log(roomProfiles);
      res.send(roomProfiles);
    });
});

app.get("/get/messages/:roomID", function (req, res) {
  Message.find({roomID: req.params.roomID}).populate("profileID")
    .exec(function (err, messages) {
      if (err) return res.sendStatus(400).end();
      let obj = {
        roomID: req.params.roomID,
        messages: messages
      };
      res.send(obj);
    });
});

app.get("/get/roomExisting/:profileID/:contactID", function (req, res) {
  RoomProfile.find({profileID: req.params.contactID})
    .exec(function (err, roomProfiles1) {
      if (err) return res.sendStatus(400).end();

      let existing = false;
      let array = [];

      for (let i = 0; i < roomProfiles1.length; i++) {
        array.push(RoomProfile.find({roomID: roomProfiles1[i].roomID})
          .exec(function (err, roomProfiles2) {
            if (err) return console.log(err);
            console.log("roomProfiles2", i, roomProfiles2);
            for (let j = 0; j < roomProfiles2.length; j++) {
              if (roomProfiles2[j].profileID == req.params.profileID) {
                console.log("GOT IT");
                existing = roomProfiles2[j]._id;
              }
            }
          }));
      }

      promiseBlueBird.all(array).then(function (arr) {
        console.log("END", existing);
        res.send(existing);
      });
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

    socket.on("login-Login.vue-Server", function (profile) {
      console.log("login-Login.vue-Server");
      console.log(profile);
      socket.join(profile._id);
    });

    socket.on("logout-???-Server", function (data) {
      console.log("logout-???-Server");
      console.log(data);
    });

    //completed
    socket.on("createNewRoom-Chat.vue-Server", function (myself, contactID) {
      console.log("createNewRoom-Chat.vue-Server");
      console.log(myself);
      console.log(contactID);

      // Profile.findById(contactID)
      //   .exec(function (err, profile) {
      //     if (err) return console.log(err);
      //     console.log(profile);
      //   });

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
              index: 1,
              chosen: true,
              name: friend.firstName + " " + friend.lastName,
              img: friend.avatar
            });

            let roomProfile2 = new RoomProfile({
              roomID: savedRoom._id,
              profileID: friend._id,
              unreadMessageCount: 0,
              index: 1,
              chosen: false,
              name: myself.firstName + " " + myself.lastName,
              img: myself.avatar
            });

            roomProfile1.save(function (err, savedRoomProfile) {
              if (err) return console.log(err);
              RoomProfile.findById(savedRoomProfile._id).populate("roomID")
                .exec(function (err, roomProfileEmit) {
                  if (err) return console.log(err);
                  socket.emit("createNewRoomSocketEmit", roomProfileEmit);
                });
              RoomProfile.find({profileID: myself._id, _id: { $ne: savedRoomProfile._id}})
                .exec(function (err, roomProfiles) {
                  if (err) return console.log(err);
                  roomProfiles.forEach(function (roomProfile) {
                    roomProfile.index++;
                    roomProfile.chosen = false;
                    roomProfile.save(function (err) {
                      if (err) return console.log(err);
                    });
                  });
                });
            });

            roomProfile2.save(function (err, savedRoomProfile) {
              if (err) return console.log(err);
              RoomProfile.findById(savedRoomProfile._id).populate("roomID")
                .exec(function (err, roomProfileBroadcast) {
                  if (err) return console.log(err);
                  socket.to(contactID).emit("createNewRoomSocketBroadcast", roomProfileBroadcast);
                });
              RoomProfile.find({profileID: friend._id, _id: { $ne: savedRoomProfile._id}})
                .exec(function (err, roomProfiles) {
                  roomProfiles.forEach(function (roomProfile) {
                    roomProfile.index++;
                    roomProfile.save(function (err) {
                      if (err) return console.log(err);
                    });
                  });
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

      let message = new Message(data);

      message.save(function (err, savedMessage) {
        if (err) return console.log(err);
        console.log("savedMessage", savedMessage);
      });

      // socket.emit("setMessageSocket", data);
      // socket.to(data.roomID).emit("setMessageSocket", data);
      // socket.emit("newLastMessageChatSidebarSocket", data);
      // socket.broadcast.emit("newLastMessageChatSidebarSocket", data);
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
