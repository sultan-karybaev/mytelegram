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
const TimePermission = require("./server/models/TimePermission");

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

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
  Profile.find({_id: { $ne: req.params.profileID}})
    .exec(function (err, profiles) {
      if (err) return console.log(err);
      res.send(profiles);
    });
});

app.get("/get/profile/:profileID", function (req, res) {
  Profile.findById(req.params.profileID)
    .exec(function (err, profile) {
      if (err) return res.sendStatus(400).end();
      res.send(profile);
    });
});

//testing
app.get("/get/rooms/:profileID", function (req, res) {
  RoomProfile.find({profileID: req.params.profileID}).populate("roomID")
    .exec(function (err, roomProfiles) {
      if (err) return res.sendStatus(400).end();
      //todo
      let array = [];
      console.log(roomProfiles);
      for (let i = 0; i < roomProfiles.length; i++) {
        console.log("!roomProfiles[i].member", !roomProfiles[i].member);
        if (!roomProfiles[i].member) {
            array.push(
              new Promise(function (resolve, reject) {
                asd(resolve);
              })
            );
            function asd(resolve) {
              TimePermission.findOne({roomProfile: roomProfiles[i]._id}).sort({endTime: -1}).limit(1)
                .exec(function (err, timepermission) {
                  if (err) return res.sendStatus(400).end();
                  roomProfiles[i].roomID.lastMessageText = timepermission.theLastText;
                  resolve();
                });
            }
        }
      }
      Promise.all(array).then(function () {
        console.log(roomProfiles);
        res.send(roomProfiles);
      });
      // promiseBlueBird.all(array).then(function () {
      //   console.log(roomProfiles);
      //   res.send(roomProfiles);
      // });
    });
});

//testing
app.get("/get/messages/:roomProfileID", function (req, res) {

  let mainMessages = [];

  RoomProfile.findById(req.params.roomProfileID)
    .exec(function (err, roomProfile) {
      if (err) return res.sendStatus(400).end();
      Message.find({roomID: roomProfile.roomID}).populate("profileID").populate("secondPerson")
        .exec(function (err, messages) {
          if (err) return res.sendStatus(400).end();
          messages.sort(function (a, b) {
            if (a.time > b.time) return 1;
            if (a.time < b.time) return -1;
            return 0;
          });

          TimePermission.find({roomProfile: req.params.roomProfileID})
            .exec(function (err, timePermissions) {
              if (err) return res.sendStatus(400).end();

              timePermissions.sort(function (a, b) {
                if (a.startTime > b.startTime) return 1;
                if (a.startTime < b.startTime) return -1;
                return 0;
              });

              for (let j = 0; j < timePermissions.length; j++) {
                for (let i = 0; i < messages.length; i++) {

                  if (timePermissions[j].endTime) {
                    if (messages[i].time >= timePermissions[j].startTime && messages[i].time <= timePermissions[j].endTime) {
                      mainMessages.push(messages[i]);
                    }
                  } else {
                    if (messages[i].time >= timePermissions[j].startTime) {
                      mainMessages.push(messages[i]);
                    }
                  }
                }
              }

              let obj = {
                roomID: roomProfile.roomID,
                messages: mainMessages
              };
              res.send(obj);
            });
        });
    });
});

app.get("/get/roomExisting/:profileID/:contactID", function (req, res) {
  RoomProfile.find({profileID: req.params.contactID}).populate("roomID")
    .exec(function (err, roomProfiles1) {
      if (err) return res.sendStatus(400).end();

      console.log(roomProfiles1);

      let existing = false;
      let array = [];

      for (let i = 0; i < roomProfiles1.length; i++) {
        if (roomProfiles1[i].roomID.typeRoom == "Standart") {
          array.push(RoomProfile.find({roomID: roomProfiles1[i].roomID._id})
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
      }

      promiseBlueBird.all(array).then(function (arr) {
        console.log("END", existing);
        res.send(existing);
      });
    });
});

//chat.vue
app.post("/post/getContactViaRoom", function (req, res) {
  RoomProfile.findOne({roomID: req.body.roomID, profileID: { $ne: req.body.profileID}}).populate("profileID")
    .exec(function (err, roomProfile) {
      if (err) return res.sendStatus(400).end();
      console.log(roomProfile);
      res.send(roomProfile.profileID);
    });
});

app.get("/get/admins/:roomID", function (req, res) {
  RoomProfile.find({roomID: req.params.roomID, admin: true, member: true}).populate("profileID")
    .exec(function (err, roomProfiles) {
      if (err) return res.sendStatus(400).end();
      res.send(roomProfiles);
    });
});

app.get("/get/members/:roomID", function (req, res) {
  RoomProfile.find({roomID: req.params.roomID, admin: false, member: true}).populate("profileID")
    .exec(function (err, roomProfiles) {
      if (err) return res.sendStatus(400).end();
      res.send(roomProfiles);
    });
});

const server = app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});

const io = require("socket.io")();
io.attach(server);

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

    //firstRoomProfile = {name, img, admin, member}
    function createRoom(room, myself, profilesArray, firstMessage, firstRoomProfile, otherRoomProfile) {
      let globalTime = firstMessage.time;

      let newRoom = new Room({
        typeRoom: room.typeRoom,
        lastMessageText: room.lastMessageText,
        lastMessageTime: room.lastMessageTime,
        memberCount: room.memberCount
      });

      //Сохраняем чат чтобы получить id
      newRoom.save(function (err, savedRoom) {
        if (err) return console.log(err);

        //---------------Создаем первое сообщение в чате для создателя чата--------------------
        //Возможные случаи: создание обычного чата, создание группы
        if (firstMessage) {
          let message = new Message({
            type: firstMessage.type,
            text: firstMessage.text,
            src: firstMessage.src,
            secondPerson: firstMessage.secondPerson,
            roomID: savedRoom._id,
            profileID: myself._id,
            time: firstMessage.time
          });

          //Созраняем первое сообщение
          message.save(function (err, savedMessage) {
            if (err) return console.log(err);
            //Ищем данное сообщение для populate
            Message.findById(savedMessage._id).populate("profileID").populate("secondPerson")
              .exec(function (err, foundMessage) {
                if (err) return console.log(err);
                let obj = {
                  roomID: savedRoom._id,
                  messages: [foundMessage]
                };
                socket.emit("setFirstMessageSocket", obj);
              });
          });
        }
        //--------------------------------

        //-----------------Создаем roomProfile для создателя чата----------------
        if (myself) {
          let myRoomProfile = new RoomProfile({
            roomID: savedRoom._id,
            profileID: myself._id,
            unreadMessageCount: 0,
            index: 1,
            chosen: true,
            name: firstRoomProfile.name,
            img: firstRoomProfile.img,
            admin: firstRoomProfile.admin,
            member: firstRoomProfile.member
          });

          myRoomProfile.save(function (err, savedMyRoomProfile) {
            if (err) return console.log(err);

            let timePermission = new TimePermission({
              roomProfile: savedMyRoomProfile._id,
              startTime: globalTime,
            });
            timePermission.save();

            //Отправляем новый roomProfile
            RoomProfile.findById(savedMyRoomProfile._id).populate("roomID")
              .exec(function (err, roomProfileEmit) {
                if (err) return console.log(err);
                socket.emit("createNewRoomSocketEmit", roomProfileEmit);
              });
            //Изменяем в базе индексы старых roomProfile
            RoomProfile.find({profileID: myself._id, _id: { $ne: savedMyRoomProfile._id}})
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
        }
        //--------------------------------------------------

        spreadRoom(savedRoom._id, profilesArray, otherRoomProfile, globalTime);
        // profilesArray.forEach(function (profile) {
        //   let roomProfile = new RoomProfile({
        //     roomID: savedRoom._id,
        //     profileID: profile._id,
        //     unreadMessageCount: 1,
        //     index: 1,
        //     chosen: false,
        //     name: otherRoomProfile.name,
        //     img: otherRoomProfile.img,
        //     admin: otherRoomProfile.admin
        //   });
        //
        //   roomProfile.save(function (err, savedRoomProfile) {
        //     if (err) return console.log(err);
        //     //Отправляем новый roomProfile
        //     RoomProfile.findById(savedRoomProfile._id).populate("roomID")
        //       .exec(function (err, roomProfileBroadcast) {
        //         if (err) return console.log(err);
        //         socket.to(profile._id).emit("createNewRoomSocketBroadcast", roomProfileBroadcast);
        //       });
        //     //Изменяем в базе старые roomProfile
        //     RoomProfile.find({profileID: profile._id, _id: { $ne: savedRoomProfile._id}})
        //       .exec(function (err, roomProfiles) {
        //         if (err) return console.log(err);
        //         roomProfiles.forEach(function (roomProfile) {
        //           roomProfile.index++;
        //           roomProfile.save(function (err) {
        //             if (err) return console.log(err);
        //           });
        //         });
        //       });
        //   });
        // });



      });
    }

    function createMessage(message, room, myRP, secondPR, commonRP, resolve) {
      let newMessage = new Message({
        type: message.type,
        text: message.text,
        src: message.src,
        secondPerson: message.secondPerson,
        roomID: message.roomID,
        profileID: message.profileID,
        time: message.time
      });

      newMessage.save(function (err, savedMessage) {
        if (err) return console.log(err);

        Message.findById(savedMessage._id).populate("profileID").populate("secondPerson")
          .exec(function (err, foundMessage) {
            if (err) return console.log(err);
            socket.emit("setMessageSocket", foundMessage);
            socket.to(message.roomID).emit("setMessageSocket", foundMessage);
          });

        Room.findById(message.roomID)
          .exec(function (err, foundRoom) {
            foundRoom.lastMessageText = room.lastMessageText;
            foundRoom.lastMessageTime = room.lastMessageTime;
            foundRoom.memberCount = room.memberCount;
            foundRoom.save(function (err, savedRoom) {
              if (err) return console.log(err);

              //roomProfilы отправителя письма
              RoomProfile.findOne({profileID: message.profileID, roomID: message.roomID}).populate("roomID")
                .exec(function (err, myRoomProfile) {
                  if (err) return console.log(err);
                  if (myRoomProfile.index != 1) {
                    //Увеличиваем индексы
                    RoomProfile.find({profileID: message.profileID, roomID: { $ne: message.roomID}})
                      .exec(function (err, roomProfiles) {
                        if (err) return console.log(err);
                        roomProfiles.forEach(function (roomProfile) {
                          roomProfile.index++;
                          roomProfile.save();
                        });
                      });
                  }

                  myRoomProfile.unreadMessageCount = 0;
                  myRoomProfile.index = 1;
                  if (commonRP) {
                    myRoomProfile.name = commonRP.name;
                    myRoomProfile.img = commonRP.img;
                  }
                  if (myRP) {
                    myRoomProfile.admin = myRP.admin;
                    myRoomProfile.member = myRP.member;
                    //Уход пользоваеля
                    if (!myRP.member) {
                      TimePermission.findOne({roomProfile: myRoomProfile._id}).sort({startTime: -1}).limit(1)
                        .exec(function (err, timepermission) {
                          if (err) return console.log(err);
                          console.log("timepermission", timepermission);
                          timepermission.endTime = message.time;
                          timepermission.theLastText = room.lastMessageText;
                          timepermission.save();
                        });
                    }
                  }
                  myRoomProfile.save(function (err, savedMyRoomProfile) {
                    if (err) return console.log(err);
                    RoomProfile.findById(savedMyRoomProfile._id).populate("roomID")
                      .exec(function (err, foundMyRoomProfile) {
                        if (err) return console.log(err);
                        socket.emit("updateRoomProfileSocket", foundMyRoomProfile);
                      });
                  });
                });

              //roomProfilы получателей письма
              RoomProfile.find({profileID: { $ne: message.profileID}, roomID: message.roomID}).populate("roomID")
                .exec(function (err, roomProfiles) {
                  if (err) return console.log(err);
                  roomProfiles.forEach(function (roomProfile) {
                    if (roomProfile.index != 1) {
                      //Увеличиваем индексы
                      RoomProfile.find({profileID: roomProfile.profileID, _id: { $ne: roomProfile._id}})
                        .exec(function (err, roomProfiles) {
                          if (err) return console.log(err);
                          roomProfiles.forEach(function (roomP) {
                            roomP.index++;
                            roomP.save();
                          })
                        });
                    }
                    if (!roomProfile.chosen && roomProfile.member) roomProfile.unreadMessageCount++;
                    roomProfile.index = 1;
                    if (commonRP) {
                      roomProfile.name = commonRP.name;
                      roomProfile.img = commonRP.img;
                    }
                    //раздел для системных сообщений
                    if (message.secondPerson  || secondPR) {
                      if (message.secondPerson._id == roomProfile.profileID) {
                        console.log("SECOND PERSON");
                        roomProfile.admin = secondPR.admin;
                        console.log(secondPR.member && !roomProfile.member);
                        console.log(!secondPR.member);
                        //Восстановление члена
                        if (secondPR.member && !roomProfile.member) {
                          let timepermission = new TimePermission({
                            roomProfile: roomProfile._id,
                            startTime: message.time
                          });
                          timepermission.save();
                          Message.findById(savedMessage._id).populate("profileID").populate("secondPerson")
                            .exec(function (err, foundMessage) {
                              if (err) return console.log(err);
                              socket.to(roomProfile.profileID).emit("setMessageSocket", foundMessage);
                            });
                        }
                        //Удаление члена
                        else if (!secondPR.member) {
                          TimePermission.findOne({roomProfile: roomProfile._id}).sort({startTime: -1}).limit(1)
                            .exec(function (err, timepermission) {
                              if (err) return console.log(err);
                              console.log("timepermission", timepermission);
                              timepermission.endTime = message.time;
                              timepermission.theLastText = room.lastMessageText;
                              timepermission.save();
                              socket.to(roomProfile.profileID).emit("updateRoomProfileSocket", {
                                roomID: savedRoom,
                                unreadMessageCount: 0,
                                index: 1,
                                chosen: roomProfile.chosen,
                                name: roomProfile.name,
                                img: roomProfile.img,
                                admin: false,
                                member: false,
                                _id: roomProfile._id
                              });
                            });
                        }
                        roomProfile.member = secondPR.member;
                      }
                    }

                    roomProfile.save(function (err, savedRoomProfile) {
                      if (err) return console.log(err);
                      RoomProfile.findById(savedRoomProfile._id).populate("roomID")
                        .exec(function (err, foundRoomProfile) {
                          if (err) return console.log(err);
                          if (foundRoomProfile.member) socket.to(roomProfile.profileID).emit("updateRoomProfileSocket", foundRoomProfile);
                        });
                    });
                  });
                  if (resolve) resolve();
                });


            });
          });


      });
    }

    function spreadRoom(roomID, profilesArray, otherRoomProfile, globalTime) {
      profilesArray.forEach(function (profile) {
        // RoomProfile.findOne({roomID: roomID, profileID: profile._id})
        //   .exec(function (err, foundRoomProfile) {
        //
        //   });


        let roomProfile = new RoomProfile({
          roomID: roomID,
          profileID: profile._id,
          unreadMessageCount: 1,
          index: 1,
          chosen: false,
          name: otherRoomProfile.name,
          img: otherRoomProfile.img,
          admin: otherRoomProfile.admin,
          member: otherRoomProfile.member
        });

        roomProfile.save(function (err, savedRoomProfile) {
          if (err) return console.log(err);

          let timePermission = new TimePermission({
            roomProfile: savedRoomProfile._id,
            startTime: globalTime,
          });
          timePermission.save();

          //Отправляем новый roomProfile
          RoomProfile.findById(savedRoomProfile._id).populate("roomID")
            .exec(function (err, roomProfileBroadcast) {
              if (err) return console.log(err);
              socket.to(profile._id).emit("createNewRoomSocketBroadcast", roomProfileBroadcast);
            });
          //Изменяем в базе старые roomProfile
          RoomProfile.find({profileID: profile._id, _id: { $ne: savedRoomProfile._id}})
            .exec(function (err, roomProfiles) {
              if (err) return console.log(err);
              roomProfiles.forEach(function (roomProfile) {
                roomProfile.index++;
                roomProfile.save(function (err) {
                  if (err) return console.log(err);
                });
              });
            });
        });
      });
    }

    socket.on("createNewRoom-Chat.vue-Server", function (myself, contactID, firstMessage) {
      console.log("createNewRoom-Chat.vue-Server");
      console.log(myself);
      console.log(contactID);
      console.log(firstMessage);

      let room = new Room({
        typeRoom: "Standart",
        lastMessageText: firstMessage.text,
        lastMessageTime: firstMessage.time,
        memberCount: 2
      });

      let otherRoomProfile = {
        name: myself.firstName + " " + myself.lastName,
        img: myself.avatar,
        admin: false,
        member: true
      };

      Profile.findById(contactID)
        .exec(function (err, profile) {
          if (err) return console.log(err);
          let firstRoomProfile = {
            name: profile.firstName + " " + profile.lastName,
            img: profile.avatar,
            admin: false,
            member: true
          };
          createRoom(room, myself, [{_id: contactID}], firstMessage, firstRoomProfile, otherRoomProfile);
        });

      // room.save(function (err, savedRoom) {
      //   if (err) return console.log(err);
      //   Profile.findById(contactID)
      //     .exec(function (err, friend) {
      //       if (err) return console.log(err);
      //
      //       let msg = new Message({
      //         type: firstMessage.type,
      //         text: firstMessage.text,
      //         roomID: savedRoom._id,
      //         profileID: myself._id,
      //         time: firstMessage.time
      //       });
      //
      //       msg.save(function (err, savedMessage) {
      //         if (err) return console.log(err);
      //         Message.findById(savedMessage._id).populate("profileID").populate("secondPerson")
      //           .exec(function (err, message) {
      //             if (err) return console.log(err);
      //             let obj = {
      //               roomID: message.roomID,
      //               messages: [message]
      //             };
      //             socket.emit("setFirstMessageSocket", obj);
      //           });
      //       });
      //
      //       let roomProfile1 = new RoomProfile({
      //         roomID: savedRoom._id,
      //         profileID: myself._id,
      //         unreadMessageCount: 0,
      //         index: 1,
      //         chosen: true,
      //         name: friend.firstName + " " + friend.lastName,
      //         img: friend.avatar,
      //         admin: false
      //       });
      //
      //       roomProfile1.save(function (err, savedRoomProfile) {
      //         if (err) return console.log(err);
      //         //Отправляем новый roomProfile
      //         RoomProfile.findById(savedRoomProfile._id).populate("roomID")
      //           .exec(function (err, roomProfileEmit) {
      //             if (err) return console.log(err);
      //             socket.emit("createNewRoomSocketEmit", roomProfileEmit);
      //           });
      //         //Изменяем в базе старые roomProfile
      //         RoomProfile.find({profileID: myself._id, _id: { $ne: savedRoomProfile._id}})
      //           .exec(function (err, roomProfiles) {
      //             if (err) return console.log(err);
      //             roomProfiles.forEach(function (roomProfile) {
      //               roomProfile.index++;
      //               roomProfile.chosen = false;
      //               roomProfile.save(function (err) {
      //                 if (err) return console.log(err);
      //               });
      //             });
      //           });
      //       });
      //
      //       let roomProfile2 = new RoomProfile({
      //         roomID: savedRoom._id,
      //         profileID: friend._id,
      //         unreadMessageCount: 1,
      //         index: 1,
      //         chosen: false,
      //         name: myself.firstName + " " + myself.lastName,
      //         img: myself.avatar,
      //         admin: false
      //       });
      //
      //       roomProfile2.save(function (err, savedRoomProfile) {
      //         if (err) return console.log(err);
      //         //Отправляем новый roomProfile
      //         RoomProfile.findById(savedRoomProfile._id).populate("roomID")
      //           .exec(function (err, roomProfileBroadcast) {
      //             if (err) return console.log(err);
      //             socket.to(contactID).emit("createNewRoomSocketBroadcast", roomProfileBroadcast);
      //           });
      //         //Изменяем в базе старые roomProfile
      //         RoomProfile.find({profileID: friend._id, _id: { $ne: savedRoomProfile._id}})
      //           .exec(function (err, roomProfiles) {
      //             if (err) return console.log(err);
      //             roomProfiles.forEach(function (roomProfile) {
      //               roomProfile.index++;
      //               roomProfile.save(function (err) {
      //                 if (err) return console.log(err);
      //               });
      //             });
      //           });
      //       });
      //     });
      // });
    });

    socket.on("createNewGroup-Chat.vue-Server", function (myself, room, message, groupName, profileArray) {
      console.log("createNewGroup-Chat.vue-Server");
      console.log(myself);
      console.log(room);
      console.log(message);
      console.log(groupName);
      console.log(profileArray);

      let firstRoomProfile = {
        name: groupName,
        img: "src/assets/avatar.jpg",
        admin: true,
        member: true
      };

      let otherRoomProfile = {
        name: groupName,
        img: "src/assets/avatar.jpg",
        admin: false,
        member: true
      };

      createRoom(room, myself, profileArray, message, firstRoomProfile, otherRoomProfile);

      // let newGroup = new Room(room);
      // newGroup.save(function (err, savedGroup) {
      //   if (err) return console.log(err);
      //
      //   message.roomID = savedGroup._id;
      //   let newMessage = new Message(message);
      //   newMessage.save(function (err, savedMessage) {
      //     if (err) return console.log(err);
      //     Message.findById(savedMessage._id).populate("profileID").populate("secondPerson")
      //       .exec(function (err, message) {
      //         if (err) return console.log(err);
      //         let obj = {
      //           roomID: savedGroup._id,
      //           messages: [message]
      //         };
      //         socket.emit("setFirstMessageSocket", obj);
      //       });
      //   });
      //
      //   let myRoomProfile = new RoomProfile({
      //     roomID: savedGroup._id,
      //     profileID: myself._id,
      //     unreadMessageCount: 0,
      //     index: 1,
      //     chosen: true,
      //     name: groupName,
      //     img: "src/assets/avatar.jpg",
      //     admin: true
      //   });
      //
      //   myRoomProfile.save(function (err, savedMyRoomProfile) {
      //     if (err) return console.log(err);
      //     //Отправляем новый roomProfile
      //     RoomProfile.findById(savedMyRoomProfile._id).populate("roomID")
      //       .exec(function (err, roomProfileEmit) {
      //         if (err) return console.log(err);
      //         socket.emit("createNewRoomSocketEmit", roomProfileEmit);
      //       });
      //     //Изменяем в базе старые roomProfile
      //     RoomProfile.find({profileID: myself._id, _id: { $ne: savedMyRoomProfile._id}})
      //       .exec(function (err, roomProfiles) {
      //         if (err) return console.log(err);
      //         roomProfiles.forEach(function (roomProfile) {
      //           roomProfile.index++;
      //           roomProfile.chosen = false;
      //           roomProfile.save(function (err) {
      //             if (err) return console.log(err);
      //           });
      //         });
      //       });
      //   });
      //
      //
      //   profileArray.forEach(function (profile) {
      //
      //     let roomProfile = new RoomProfile({
      //       roomID: savedGroup._id,
      //       profileID: profile._id,
      //       unreadMessageCount: 1,
      //       index: 1,
      //       chosen: false,
      //       name: groupName,
      //       img: "src/assets/avatar.jpg",
      //       admin: false
      //     });
      //
      //     //todo
      //
      //     roomProfile.save(function (err, savedRoomProfile) {
      //       if (err) return console.log(err);
      //       //Отправляем новый roomProfile
      //       RoomProfile.findById(savedRoomProfile._id).populate("roomID")
      //         .exec(function (err, roomProfileBroadcast) {
      //           if (err) return console.log(err);
      //           socket.to(profile._id).emit("createNewRoomSocketBroadcast", roomProfileBroadcast);
      //         });
      //       //Изменяем в базе старые roomProfile
      //       RoomProfile.find({profileID: profile._id, _id: { $ne: savedRoomProfile._id}})
      //         .exec(function (err, roomProfiles) {
      //           if (err) return console.log(err);
      //           roomProfiles.forEach(function (roomProfile) {
      //             roomProfile.index++;
      //             roomProfile.save(function (err) {
      //               if (err) return console.log(err);
      //             });
      //           });
      //         });
      //     });
      //
      //   });
      //
      //
      // });
    });

    socket.on("addMembersToGroup-Chat.vue-Server", function (myself, roomProfile, profileArray) {
      console.log("addMembersToGroup-Chat.vue-Server");
      console.log(myself);
      console.log(roomProfile);
      console.log(profileArray);

      let otherRoomProfile = {
        name: roomProfile.name,
        img: roomProfile.img,
        admin: false,
        member: true
      };

      let commonRP = {
        name: roomProfile.name,
        img: roomProfile.img,
      };

      let myRP = {
        admin: true,
        member: true
      };

      let secondRP = {
        admin: false,
        member: true
      };

      let promiseArray = [];

      for (let i = 0; i < profileArray.length; i++) {

        promiseArray.push(
          new Promise(function (res, rej) {
            foo(res);
          })
        );
        function foo(res) {
          let globalTime = new Date().getTime();

          let room = {
            lastMessageText: myself.firstName + " invite to group " + profileArray[i].firstName,
            lastMessageTime: globalTime,
            memberCount: roomProfile.roomID.memberCount + profileArray.length
          };

          let message = {
            type: "System",
            text: " invite to group ",
            secondPerson: profileArray[i],
            roomID: roomProfile.roomID._id,
            profileID: myself._id,
            time: globalTime
          };

          RoomProfile.findOne({roomID: roomProfile.roomID._id, profileID: profileArray[i]._id})
            .exec(function (err, foundRoomProfile) {
              if (err) return console.log(err);
              if (foundRoomProfile) {
                createMessage(message, room, myRP, secondRP, commonRP);
                res();
              } else {
                let promise = new Promise(function (resolve, reject) {
                  createMessage(message, room, myRP, secondRP, commonRP, resolve);
                });
                promise.then(function () {
                  spreadRoom(roomProfile.roomID._id, [profileArray[i]], otherRoomProfile, globalTime);
                  res();
                });
              }
            });
        }
      }

      Promise.race(promiseArray).then(function () {
        console.log("PROMISE");
      })

    });

    socket.on("removeMemberFromGroup-Chat.vue-Server", function (myself, roomProfile, profileMember) {
      console.log("removeMemberFromGroup-Chat.vue-Server");
      console.log(myself);
      console.log(roomProfile);
      console.log(profileMember);
      let globalTime = new Date().getTime();

      let myRP = {
        admin: true,
        member: true
      };

      let secondRP = {
        admin: false,
        member: false
      };

      let room = {
        lastMessageText: myself.firstName + " removed from group " + profileMember.firstName,
        lastMessageTime: globalTime,
        memberCount: roomProfile.roomID.memberCount - 1
      };

      let message = {
        type: "System",
        text: " removed from group ",
        secondPerson: profileMember,
        roomID: roomProfile.roomID._id,
        profileID: myself._id,
        time: globalTime
      };

      createMessage(message, room, myRP, secondRP);

    });

    socket.on("assignAdmin-Chat.vue-Server", function (myself, roomProfile, profileMember) {
      console.log("assignAdmin-Chat.vue-Server");
      console.log(myself);
      console.log(roomProfile);
      console.log(profileMember);
      let globalTime = new Date().getTime();

      let myRP = {
        admin: true,
        member: true
      };

      let secondRP = {
        admin: true,
        member: true
      };

      let room = {
        lastMessageText: myself.firstName + " assign new group admin " + profileMember.firstName,
        lastMessageTime: globalTime,
        memberCount: roomProfile.roomID.memberCount
      };

      let message = {
        type: "System",
        text: " assign new group admin ",
        secondPerson: profileMember,
        roomID: roomProfile.roomID._id,
        profileID: myself._id,
        time: globalTime
      };

      createMessage(message, room, myRP, secondRP);
    });

    socket.on("removeAdmin-Chat.vue-Server", function (myself, roomProfile, profileMember) {
      console.log("assignAdmin-Chat.vue-Server");
      console.log(myself);
      console.log(roomProfile);
      console.log(profileMember);
      let globalTime = new Date().getTime();

      let myRP = {
        admin: true,
        member: true
      };

      let secondRP = {
        admin: false,
        member: true
      };

      let room = {
        lastMessageText: myself.firstName + " remove from group admins " + profileMember.firstName,
        lastMessageTime: globalTime,
        memberCount: roomProfile.roomID.memberCount
      };

      let message = {
        type: "System",
        text: " remove from group admins ",
        secondPerson: profileMember,
        roomID: roomProfile.roomID._id,
        profileID: myself._id,
        time: globalTime
      };

      createMessage(message, room, myRP, secondRP);
    });

    socket.on("leaveGroup-Chat.vue-Server", function (myself, roomProfile) {
      console.log("leaveGroup-Chat.vue-Server");
      console.log(myself);
      console.log(roomProfile);
      let globalTime = new Date().getTime();

      let myRP = {
        admin: false,
        member: false
      };

      let room = {
        lastMessageText: myself.firstName + " left this group",
        lastMessageTime: globalTime,
        memberCount: roomProfile.roomID.memberCount - 1
      };

      let message = {
        type: "System",
        text: " left this group",
        roomID: roomProfile.roomID._id,
        profileID: myself._id,
        time: globalTime
      };

      createMessage(message, room, myRP);
    });

    socket.on("enterRoom-ChatSidebar.vue-Server", function (roomID) {
      console.log("enterRoom-ChatSidebar.vue-Server");
      console.log(roomID);
      socket.join(roomID);
    });

    socket.on("leaveRoom-ChatSidebar.vue-Server", function (roomID) {
      console.log("leaveRoom-ChatSidebar.vue-Server");
      console.log(roomID);
      socket.leave(roomID);
    });

    socket.on("chooseRoom-ChatSidebar.vue-Server", function (roomID, profileID) {
      console.log("chooseRoom-ChatSidebar.vue-Server");
      console.log(roomID);
      console.log(profileID);

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

    socket.on("setMessage-ChatSidebarContact.vue-Server", function (data, roomData) {
      console.log("setMessage-ChatSidebarContact.vue-Server");
      console.log(data);

      let room = {
        lastMessageText: data.text,
        lastMessageTime: data.time,
        memberCount: roomData.memberCount
      };

      createMessage(data, room);

      // let message = new Message(data);
      //
      // message.save(function (err, savedMessage) {
      //   if (err) return console.log(err);
      //   Room.findById(data.roomID)
      //     .exec(function (err, room) {
      //       if (err) return console.log(err);
      //       room.lastMessageText = data.text;
      //       room.lastMessageTime = data.time;
      //       room.save(function (err, savedRoom) {
      //         if (err) return console.log(err);
      //         Message.findById(savedMessage._id).populate("profileID").populate("secondPerson")
      //           .exec(function (err, foundMessage) {
      //             if (err) return console.log(err);
      //
      //             socket.emit("setMessageSocket", foundMessage);
      //             socket.to(data.roomID).emit("setMessageSocket", foundMessage);
      //             socket.emit("setLastMessageSocket", savedRoom);
      //
      //             //Увеличиваем количество непрочитанных сообщений
      //             RoomProfile.find({profileID: { $ne: data.profileID}, roomID: data.roomID})
      //               .exec(function (err, roomProfiles) {
      //                 if (err) return console.log(err);
      //                 roomProfiles.forEach(function (roomProfile) {
      //                   if (!roomProfile.chosen) roomProfile.unreadMessageCount++;
      //                   roomProfile.index = 1;
      //                   roomProfile.save();
      //                   //Увеличиваем индексы
      //                   RoomProfile.find({profileID: roomProfile.profileID, _id: { $ne: roomProfile._id}})
      //                     .exec(function (err, roomProfiles) {
      //                       if (err) return console.log(err);
      //                       roomProfiles.forEach(function (roomP) {
      //                         roomP.index++;
      //                         roomP.save();
      //                       })
      //                     });
      //                 })
      //               });
      //
      //             //Рассылаем всем участникам группы сообщение
      //             RoomProfile.find({roomID: data.roomID})
      //               .exec(function (err, roomProfiles) {
      //                 if (err) return console.log(err);
      //                 for (let i = 0; i < roomProfiles.length; i++) {
      //                   socket.to(roomProfiles[i].profileID).emit("setLastMessageSocket", savedRoom);
      //                 }
      //               });
      //
      //           });
      //       });
      //     });
      // });
    });

    socket.on("File-ChatSidebarContact.vue-Server", function (File, mainMessage, addData, roomData) {
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

      let room = {
        lastMessageText: mainMessage.text,
        lastMessageTime: mainMessage.time,
        memberCount: roomData.memberCount
      };

      mainMessage.src = "../../static/" + varDir + "/" + addData.name + varExp;
      fs.writeFile(__dirname + "/static/" + varDir + "/" + addData.name + varExp, File,  "binary", function(err) {
        if(err) return console.log(err);
        createMessage(mainMessage, room);
        // let message = new Message(mainMessage);
        // message.save(function (err, savedMessage) {
        //   if (err) return console.log(err);
        //   Message.findById(savedMessage._id).populate("profileID")
        //     .exec(function (err, foundMessage) {
        //       if(err) return console.log(err);
        //       console.log("The file was saved!");
        //       socket.emit("setMessageSocket", foundMessage);
        //       socket.to(mainMessage.roomID).emit("setMessageSocket", foundMessage);
        //
        //       RoomProfile.find({profileID: { $ne: mainMessage.profileID}, roomID: mainMessage.roomID})
        //         .exec(function (err, roomProfiles) {
        //           if (err) return console.log(err);
        //           roomProfiles.forEach(function (roomProfile) {
        //             if (!roomProfile.chosen) roomProfile.unreadMessageCount++;
        //             roomProfile.index = 1;
        //             roomProfile.save();
        //             //Увеличиваем индексы
        //             RoomProfile.find({profileID: roomProfile.profileID, _id: { $ne: roomProfile._id}})
        //               .exec(function (err, roomProfiles) {
        //                 if (err) return console.log(err);
        //                 roomProfiles.forEach(function (roomP) {
        //                   roomP.index++;
        //                   roomP.save();
        //                 })
        //               });
        //           })
        //         });
        //     });
        // });
      });

      //Last Message
      // Room.findById(mainMessage.roomID)
      //   .exec(function (err, room) {
      //     if (err) return console.log(err);
      //     room.lastMessageText = varFileType;
      //     room.lastMessageTime = mainMessage.time;
      //     room.save(function (err, savedRoom) {
      //       if (err) return console.log(err);
      //
      //       socket.emit("setLastMessageSocket", savedRoom);
      //
      //       RoomProfile.find({roomID: mainMessage.roomID})
      //         .exec(function (err, roomProfiles) {
      //           if (err) return console.log(err);
      //           for (let i = 0; i < roomProfiles.length; i++) {
      //             socket.to(roomProfiles[i].profileID).emit("setLastMessageSocket", savedRoom);
      //           }
      //         });
      //     });
      //   });
    });
  });
}

socketEvents(io);
