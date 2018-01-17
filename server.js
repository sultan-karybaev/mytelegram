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
    avatar: "src/assets/avatar.jpg",
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
      messages.sort(function (a, b) {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;
        return 0;
      });
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
                existing = roomProfiles2[j];
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

    socket.on("createNewRoom-Chat.vue-Server", function (myself, contactID, firstMessage) {
      console.log("createNewRoom-Chat.vue-Server");
      console.log(myself);
      console.log(contactID);
      console.log(firstMessage);

      let room = new Room({
        typeRoom: "Standart",
        lastMessageText: firstMessage.text,
        lastMessageTime: firstMessage.time,
      });

      room.save(function (err, savedRoom) {
        if (err) return console.log(err);
        Profile.findById(contactID)
          .exec(function (err, friend) {
            if (err) return console.log(err);

            let msg = new Message({
              type: firstMessage.type,
              text: firstMessage.text,
              roomID: savedRoom._id,
              profileID: myself._id,
              time: firstMessage.time
            });

            msg.save(function (err, savedMessage) {
              if (err) return console.log(err);
              Message.findById(savedMessage._id).populate("profileID")
                .exec(function (err, message) {
                  if (err) return console.log(err);
                  let obj = {
                    roomID: message.roomID,
                    messages: [message]
                  };
                  socket.emit("setFirstMessageSocket", obj);
                });
            });

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
              unreadMessageCount: 1,
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
    });

    socket.on("enterRoom-ChatSidebar.vue-Server", function (roomID, profileID) {
      console.log("enterRoom-ChatSidebar.vue-Server");
      console.log(roomID);
      socket.join(roomID);

      RoomProfile.findOne({profileID: profileID, roomID: roomID})
        .exec(function (err, roomProfile) {
          if (err) return console.log(err);
          roomProfile.chosen = true;
          roomProfile.unreadMessageCount = 0;
          roomProfile.save();
        });

      RoomProfile.find({profileID: profileID, roomID: { $ne: roomID}})
        .exec(function (err, roomProfiles) {
          if (err) return console.log(err);
          roomProfiles.forEach(function (roomProfile) {
            roomProfile.chosen = false;
            roomProfile.save();
          });
        });
    });

    socket.on("indexRoom-ChatSidebarContact.vue-Server", function (profileID, roomID) {
      console.log("indexRoom-ChatSidebarContact.vue-Server");

      RoomProfile.findOne({profileID: profileID, roomID: roomID})
        .exec(function (err, roomProfile) {
          if (err) return console.log(err);
          roomProfile.index = 1;
          roomProfile.save();
        });
      RoomProfile.find({profileID: profileID, roomID: { $ne: roomID}})
        .exec(function (err, roomProfiles) {
          if (err) return console.log(err);
          roomProfiles.forEach(function (roomProfile) {
            roomProfile.index++;
            roomProfile.save();
          })
        });
    });

    socket.on("setMessage-ChatSidebarContact.vue-Server", function (data) {
      console.log("setMessage-ChatSidebarContact.vue-Server");
      console.log(data);

      let message = new Message(data);

      message.save(function (err, savedMessage) {
        if (err) return console.log(err);
        Room.findById(data.roomID)
          .exec(function (err, room) {
            if (err) return console.log(err);
            room.lastMessageText = data.text;
            room.lastMessageTime = data.time;
            room.save(function (err, savedRoom) {
              if (err) return console.log(err);
              Message.findById(savedMessage._id).populate("profileID")
                .exec(function (err, foundMessage) {
                  if (err) return console.log(err);

                  socket.emit("setMessageSocket", foundMessage);
                  socket.to(data.roomID).emit("setMessageSocket", foundMessage);
                  socket.emit("setLastMessageSocket", savedRoom);

                  //Увеличиваем количество непрочитанных сообщений
                  RoomProfile.find({profileID: { $ne: data.profileID}, roomID: data.roomID})
                    .exec(function (err, roomProfiles) {
                      if (err) return console.log(err);
                      roomProfiles.forEach(function (roomProfile) {
                        if (!roomProfile.chosen) roomProfile.unreadMessageCount++;
                        roomProfile.index = 1;
                        roomProfile.save();
                        //Увеличиваем индексы
                        RoomProfile.find({profileID: roomProfile.profileID, _id: { $ne: roomProfile._id}})
                          .exec(function (err, roomProfiles) {
                            if (err) return console.log(err);
                            roomProfiles.forEach(function (roomP) {
                              roomP.index++;
                              roomP.save();
                            })
                          });
                      })
                    });

                  //Рассылаем всем участникам группы сообщение
                  RoomProfile.find({roomID: data.roomID})
                    .exec(function (err, roomProfiles) {
                      if (err) return console.log(err);
                      for (let i = 0; i < roomProfiles.length; i++) {
                        socket.to(roomProfiles[i].profileID).emit("setLastMessageSocket", savedRoom);
                      }
                    });

                });
            });
          });
      });
    });

    socket.on("File-ChatSidebarContact.vue-Server", function (File, mainMessage, addData) {
      console.log("File-ChatSidebarContact.vue-Server");
      console.log(File);
      console.log(mainMessage);

      let varDir;
      let varExp;
      let varFileType;

      if (mainMessage.type == "Audio") {
        varDir = "media";
        varExp = ".wav";
        varFileType = "Audio File";
      } else if (mainMessage.type == "Image") {
        varDir = "img";
        varExp = ".jpg";
        varFileType = "Image";
      }

      mainMessage.src = "../../static/" + varDir + "/" + addData.name + varExp;
      fs.writeFile(__dirname + "/static/" + varDir + "/" + addData.name + varExp, File,  "binary", function(err) {
        if(err) return console.log(err);
        let message = new Message(mainMessage);
        message.save(function (err, savedMessage) {
          if (err) return console.log(err);
          Message.findById(savedMessage._id).populate("profileID")
            .exec(function (err, foundMessage) {
              if(err) return console.log(err);
              console.log("The file was saved!");
              socket.emit("setMessageSocket", foundMessage);
              socket.to(mainMessage.roomID).emit("setMessageSocket", foundMessage);

              RoomProfile.find({profileID: { $ne: mainMessage.profileID}, roomID: mainMessage.roomID})
                .exec(function (err, roomProfiles) {
                  if (err) return console.log(err);
                  roomProfiles.forEach(function (roomProfile) {
                    if (!roomProfile.chosen) roomProfile.unreadMessageCount++;
                    roomProfile.index = 1;
                    roomProfile.save();
                    //Увеличиваем индексы
                    RoomProfile.find({profileID: roomProfile.profileID, _id: { $ne: roomProfile._id}})
                      .exec(function (err, roomProfiles) {
                        if (err) return console.log(err);
                        roomProfiles.forEach(function (roomP) {
                          roomP.index++;
                          roomP.save();
                        })
                      });
                  })
                });
            });
        });
      });

      //Last Message
      Room.findById(mainMessage.roomID)
        .exec(function (err, room) {
          if (err) return console.log(err);
          room.lastMessageText = varFileType;
          room.lastMessageTime = mainMessage.time;
          room.save(function (err, savedRoom) {
            if (err) return console.log(err);

            socket.emit("setLastMessageSocket", savedRoom);

            RoomProfile.find({roomID: mainMessage.roomID})
              .exec(function (err, roomProfiles) {
                if (err) return console.log(err);
                for (let i = 0; i < roomProfiles.length; i++) {
                  socket.to(roomProfiles[i].profileID).emit("setLastMessageSocket", savedRoom);
                }
              });
          });
        });
    });

    // socket.on("image-ChatSidebarContact.vue-Server", function (data, img, message) {
    //   console.log("image");
    //   console.log(data);
    //   console.log(img);
    //   console.log(message);
    //   let lastMessage = {
    //     roomID: message.roomID,
    //     text: "Image",
    //     time: message.time,
    //   };
    //   message.text = "<img src=\"static/img/" + img.name + "\" style=\"width: 320px\"/>";
    //   fs.writeFile(__dirname + "/static/img/" + img.name, data,  "binary", function(err) {
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       console.log("The file was saved!");
    //       socket.emit("setMessageSocket", message);
    //       socket.broadcast.emit("setMessageSocket", message);
    //       // socket.emit("newLastMessageChatSidebarSocket", lastMessage);
    //       // socket.broadcast.emit("newLastMessageChatSidebarSocket", lastMessage);
    //     }
    //   });
    // });
  });
}

socketEvents(io);
