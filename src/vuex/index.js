import Vue from 'vue'
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 5,
    words: [[{name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"},
      {name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"},
      {name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"},
      {name: "Nick", text: "Hey, how are you?", time: "12 Oct"}, {name: "John", text: "I'm fine, thanks", time: "12 Oct"}
    ], [{name: "Tom", text: "Hi, my name is Tom", time: "12 Oct"}, {name: "Alan", text: "London is a capital of Great Britain", time: "12 Oct"},
      {name: "Tom", text: "Hi, my name is Tom", time: "12 Oct"}, {name: "Alan", text: "London is a capital of Great Britain", time: "12 Oct"},
      {name: "Tom", text: "Hi, my name is Tom", time: "12 Oct"}, {name: "Alan", text: "London is a capital of Great Britain", time: "12 Oct"},
      {name: "Tom", text: "Hi, my name is Tom", time: "12 Oct"}, {name: "Alan", text: "London is a capital of Great Britain", time: "12 Oct"},
    ], [{name: "Kevin", text: "I am from Canada", time: "12 Oct"}, {name: "Elon", text: "I am a CEO of SpaceX and Tesla", time: "12 Oct"},
      {name: "Kevin", text: "I am from Canada", time: "12 Oct"}, {name: "Elon", text: "I am a CEO of SpaceX and Tesla", time: "12 Oct"},
      {name: "Kevin", text: "I am from Canada", time: "12 Oct"}, {name: "Elon", text: "I am a CEO of SpaceX and Tesla", time: "12 Oct"},
    ]],
    users: [{userID: 1, firstName: "Jack", lastName: "Dawson"}, {userID: 2, firstName: "Tom", lastName: "Hanks"},
      {userID: 3, firstName: "Elon", lastName: "Musk"}, {userID: 4, firstName: "Jack", lastName: "Dalbert"},
      {userID: 5, firstName: "Sherlock", lastName: "Holmes"}, {userID: 6, firstName: "Tonny", lastName: "Stark"},
      {userID: 7, firstName: "Leonardo", lastName: "DiCaprio"}, {userID: 8, firstName: "Jimmy", lastName: "Fallon"},
      {userID: 7774921228, firstName: 7774921228, lastName: "Last"},
      {userID: 7472525236, firstName: 7472525236, lastName: "Last"},
      {userID: 7471151837, firstName: 7471151837, lastName: "Last"},
    ],
    rooms: [
      {roomID: 1, typeRoom: "Open", chosenClass: "unchosen", chatUserID: 1, lastMessageText: "I'm fine, thanks777", lastMessageTime: "12/07/17", unreadMessageCount: 0},
      {roomID: 2, typeRoom: "Open", chosenClass: "unchosen", chatUserID: 2, lastMessageText: "London is a capital of Great Britain", lastMessageTime: "12/07/17", unreadMessageCount: 0},
      {roomID: 3, typeRoom: "Open", chosenClass: "unchosen", chatUserID: 3, lastMessageText: "I am a CEO of SpaceX and Tesla", lastMessageTime: "12/07/17", unreadMessageCount: 0}
      ],
    messages: [{messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 1, src: "../../static/media/kissvk.com--qb-Imagine%20Dragons-Whatever%20It%20Takes.mp3", time: "12/07/17", senderName: "Jack", type: "Audio"},
      {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 1, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack", type: "Text"},
      {messageID: 33, roomID: 1, senderID: 1, src: "../../static/media/kissvk.com-Green%20Day-Boulevard%20of%20Broken%20Dreams-Acoustic-.mp3", time: "12/07/17", senderName: "Jack", type: "Audio"},

      {messageID: 33, roomID: 2, senderID: 2, src: "../../static/media/kissvk.com-The Script feat. will.i.am-Hall of Fame.mp3", time: "12/07/17", senderName: "Tom", type: "Audio"},
      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 2, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom", type: "Text"},
      {messageID: 33, roomID: 2, senderID: 2, src: "../../static/media/kissvk.com-The Script feat. will.i.am-Hall of Fame.mp3", time: "12/07/17", senderName: "Tom", type: "Audio"},


      {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 3, senderID: 3, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon", type: "Text"},
      {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 3, senderID: 3, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon", type: "Text"},
      {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan", type: "Text"},
      {messageID: 33, roomID: 3, senderID: 3, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon", type: "Text"},
    ],
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
      Event.$emit("audio");
    },
    pushRoom(state, {type, items}) {
      console.log("pushRoom");

      let currentUser;

      for (let i = 0; i < state.users.length; i++) {
        console.log("items", items);
        console.log("items.userID", items.userID);
        console.log("state.users[i].userID", state.users[i].userID);
        console.log(state.users[i].userID == items.userID);
        if (state.users[i].userID == items.userID) {
          currentUser = state.users[i];
          break;
        }
      }

      console.log(currentUser);

      state[type].push({
        roomID: state.rooms.length + 1,
        typeRoom: "Open",
        chatUserID: items.userID,
        user: currentUser,
        lastMessage: {messageID: 33,
          roomID: state.rooms.length + 1,
          senderID: items.userID,
          text: "",
          time: "",
          senderName: ""}
      });
      console.log(state.rooms);
    },
  },
  getters: {
    getRooms: function (state) {
      state.rooms.forEach(function (room) {
        state.users.forEach(function (user) {
          if (user.userID === room.chatUserID) room.user = user;
        })
      });
      return state.rooms;
    },
    getContacts: function (state) {
      return state.users;
    },
    getRoomExisting: (state) => (userID) => {
      console.log("getRoomExisting " + userID);
      for (let i = 0; i < state.rooms.length; i++) {
        console.log(state.rooms[i].chatUserID === userID);
        if (state.rooms[i].chatUserID === userID) return state.rooms[i].roomID;
      }
      return false;
    },
    getMessages: (state) => (id) => {
      let array = [];
      let senderID;
      let secondParams;
      let currentIndex = -1;
      for (let i = 0; i < state.messages.length; i++) {
        if (state.messages[i].roomID == id) {
          secondParams = {
            messageID: state.messages[i].messageID,
            text: state.messages[i].text,
            src: state.messages[i].src,
            time: state.messages[i].time,
            type: state.messages[i].type,
          };

          console.log(senderID !== state.messages[i].senderID);
          if (senderID !== state.messages[i].senderID) {
            senderID = state.messages[i].senderID;
            currentIndex++;

            array.push({
              roomID: state.messages[i].roomID,
              senderID: state.messages[i].senderID,
              senderName: state.messages[i].senderName,
              messageArray: [secondParams]
            });
          } else {
            array[currentIndex].messageArray.push(secondParams);
          }
          //array.push(state.messages[i]);
        }
      }
      return array;
    },
    getSenderUser: (state) => (roomID) => {
      for (let i = 0; i < state.rooms.length; i++) {
        if (state.rooms[i].roomID == roomID) {
          for (let j = 0; j < state.users.length; j++) {
            if (state.users[j].userID == state.rooms[i].chatUserID) {
              return state.users[j];
            }
          }
        }
      }
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
    setUser({commit}, query) {
      commit('set', {type: 'user', items: query})
    },
    setMessage({commit}, query) {
      commit('push', {type: 'messages', items: query})
    },
    setNewRoom({commit}, query) {
      console.log("setNewRoom");
      commit('pushRoom', {type: 'rooms', items: query})
    },
    setUserAccount({commit}, query) {
      commit('set', {type: 'userAccount', items: query})
    }
  }
})


// this.$store.dispatch('setUser', response.userObject)
