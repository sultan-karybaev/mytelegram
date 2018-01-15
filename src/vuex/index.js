import Vue from 'vue'
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // users: [{userID: 1, firstName: "Jack", lastName: "Dawson"}, {userID: 2, firstName: "Tom", lastName: "Hanks"},
    //   {userID: 3, firstName: "Elon", lastName: "Musk"}, {userID: 4, firstName: "Jack", lastName: "Dalbert"},
    //   {userID: 5, firstName: "Sherlock", lastName: "Holmes"}, {userID: 6, firstName: "Tonny", lastName: "Stark"},
    //   {userID: 7, firstName: "Leonardo", lastName: "DiCaprio"}, {userID: 8, firstName: "Jimmy", lastName: "Fallon"},
    //   {userID: 7774921228, firstName: 7774921228, lastName: "Last"},
    //   {userID: 7472525236, firstName: 7472525236, lastName: "Last"},
    //   {userID: 7471151837, firstName: 7471151837, lastName: "Last"},
    // ],
    // rooms: [
    //   {roomID: 1, typeRoom: "Open", chosenClass: "unchosen", chatUserID: 1, lastMessageText: "I'm fine, thanks777", lastMessageTime: "12/07/17", unreadMessageCount: 0},
    //   {roomID: 2, typeRoom: "Open", chosenClass: "unchosen", chatUserID: 2, lastMessageText: "London is a capital of Great Britain", lastMessageTime: "12/07/17", unreadMessageCount: 0},
    //   {roomID: 3, typeRoom: "Open", chosenClass: "unchosen", chatUserID: 3, lastMessageText: "I am a CEO of SpaceX and Tesla", lastMessageTime: "12/07/17", unreadMessageCount: 0}
    //   ],
    // messages: [{messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 1, src: "../../static/media/kissvk.com--qb-Imagine%20Dragons-Whatever%20It%20Takes.mp3", time: "12/07/17", senderName: "Jack", type: "Audio"},
    //   {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
    //   {messageID: 33, roomID: 1, senderID: 1, src: "../../static/media/kissvk.com-Green%20Day-Boulevard%20of%20Broken%20Dreams-Acoustic-.mp3", time: "12/07/17", senderName: "Jack", type: "Audio"},
    //   {messageID: 33, roomID: 1, senderID: 1, text: "<img src=\"static/img/prometey-sanchez-noskov-340992.jpg\" style=\"width: 320px\"/>", time: "12/07/17", senderName: "Jack", type: "Text"},
    //
    //
    //   {messageID: 33, roomID: 2, senderID: 2, src: "static/media/kissvk.com-The Script feat. will.i.am-Hall of Fame.mp3", time: "12/07/17", senderName: "Tom", type: "Audio"},
    //   {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
    //   {messageID: 33, roomID: 2, senderID: 2, src: "../../static/media/kissvk.com-The Script feat. will.i.am-Hall of Fame.mp3", time: "12/07/17", senderName: "Tom", type: "Audio"},
    //
    //
    //   {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 3, senderID: 3, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon", type: "Text"},
    //   {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 3, senderID: 3, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon", type: "Text"},
    //   {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan", type: "Text"},
    //   {messageID: 33, roomID: 3, senderID: 3, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon", type: "Text"},
    // ],
    users: [],
    rooms: [],
    allMessageArray: [],
    userAccount: {}
  },
  mutations: {
    arrayPush (state, payload) {
      console.log("Hahaha");
      console.log(payload);
      state.words[payload.number].push(payload.obj);
      console.log(state.words);
    },
    set(state, {type, items}){
      state[type] = items
    },
    push(state, {type, items}){
      state[type].push(items);
      //Event.$emit("audio");
    },
    pushRoomEmit(state, {type, items}) {
      console.log("pushRoomEmit");
      for (let i = 0; i < state.rooms.length; i++) {
        state.rooms[i].index++;
        state.rooms[i].chosen = false;
      }
      state[type].push(items);
    },
    pushRoomBroadcast(state, {type, items}) {
      console.log("pushRoomBroadcast");
      for (let i = 0; i < state.rooms.length; i++) {
        state.rooms[i].index++;
      }
      state[type].push(items);
    },
    setRoomChosen(state, roomID) {
      console.log(roomID);
      for (let i = 0; i < state.rooms.length; i++) {
        console.log("state.rooms[i]._id", state.rooms[i]._id);
        console.log("roomID", roomID);
        console.log(state.rooms[i]._id !== roomID);
        if (state.rooms[i]._id !== roomID) {
          state.rooms[i].chosen = false;
        } else {
          state.rooms[i].chosen = true;
        }
      }
      console.log(state.rooms);
    }
  },
  getters: {
    getRooms: function (state) {
      state.rooms.sort(function (a, b) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      });
      console.log("state.rooms", state.rooms);
      return state.rooms;
    },
    getContacts: function (state) {
      return state.users;
    },
    getRoomExisting: (state) => (contactID) => {
      console.log("getRoomExisting " + contactID);
      for (let i = 0; i < state.rooms.length; i++) {
        console.log(state.rooms[i].roomID === contactID);
        if (state.rooms[i].chatUserID === contactID) return state.rooms[i].roomID;
      }
      return false;
    },
    //Переделать
    getMessages: (state) => (id) => {
      let array = [];
      //let senderID;
      let user = {
        _id: 0
      };
      let messageParams;
      let currentIndex = -1;
      // for (let i = 0; i < state.messages.length; i++) {
      //   if (state.messages[i].roomID == id) {
      //     secondParams = {
      //       messageID: state.messages[i].messageID,
      //       text: state.messages[i].text,
      //       src: state.messages[i].src,
      //       time: state.messages[i].time,
      //       type: state.messages[i].type,
      //     };
      //
      //     //console.log(senderID !== state.messages[i].senderID);
      //     if (senderID !== state.messages[i].senderID) {
      //       senderID = state.messages[i].senderID;
      //       currentIndex++;
      //
      //       array.push({
      //         roomID: state.messages[i].roomID,
      //         senderID: state.messages[i].senderID,
      //         senderName: state.messages[i].senderName,
      //         messageArray: [secondParams]
      //       });
      //     } else {
      //       array[currentIndex].messageArray.push(secondParams);
      //     }
      //   }
      // }
      // return array;


      for (let i = 0; i < state.allMessageArray.length; i++) {
        if (state.allMessageArray[i].roomID == id) {
          let messages = state.allMessageArray[i].messages;
          for (let j = 0; j < messages.length; j++) {
            messageParams = {
              messageID: messages[j]._id,
              text: messages[j].text,
              src: messages[j].src,
              time: messages[j].time,
              type: messages[j].type,
            };

            //console.log(senderID !== state.messages[i].senderID);
            if (user._id !== messages[j].profileID._id) {
              user = messages[j].profileID;
              currentIndex++;
              array.push({
                profile: messages[j].profileID,
                messageArray: [messageParams]
              });
            } else {
              array[currentIndex].messageArray.push(messageParams);
            }
          }
        }
      }
      return array;
    },
    // getSenderUser: (state) => (roomID) => {
    //   for (let i = 0; i < state.rooms.length; i++) {
    //     if (state.rooms[i].roomID == roomID) {
    //       for (let j = 0; j < state.users.length; j++) {
    //         if (state.users[j].userID == state.rooms[i].chatUserID) {
    //           return state.users[j];
    //         }
    //       }
    //     }
    //   }
    // },
    getMessegesTest: function (state) {
      return state.allMessageArray;
    },
    getUser: function (state) {
      return state.userAccount;
    },
    getExistingUserAccount: (state) => {
      if (state.userAccount.userID) return true;
      else return false;
    }
  },
  actions: {
    //Example
    setUserExample({commit}, query) {
      commit('set', {type: 'user', items: query})
    },
    //Изменить
    // setMessageMainjs({commit}, query) {
    //   commit('push', {type: 'messages', items: query})
    // },
    setNewRoomEmitMainjs({commit}, query) {
      console.log("setNewRoom");
      commit('pushRoomEmit', {type: 'rooms', items: query})
    },
    setNewRoomBroadcastMainjs({commit}, query) {
      console.log("setNewRoom");
      commit('pushRoomBroadcast', {type: 'rooms', items: query})
    },
    setUserAccountLoginvue({commit}, query) {
      console.log("setUserAccount");
      commit('set', {type: 'userAccount', items: query})
    },
    setContactsLoginvue({commit}, query) {
      commit('set', {type: 'users', items: query})
    },
    setRoomsLoginvue({commit}, query) {
      console.log("setRoomsLoginvue");
      console.log(query);
      commit('set', {type: 'rooms', items: query})
    },
    setMessagesLoginvue({commit}, query) {
      console.log("setMessagesLoginvue");
      console.log(query);
      commit('push', {type: 'allMessageArray', items: query})
    },
    setRoomChosenChatvue({commit}, query) {
      console.log("setRoomChosenChatvue");
      console.log(query);
      commit('setRoomChosen', query)
    }
  }
})


// this.$store.dispatch('setUser', response.userObject)
