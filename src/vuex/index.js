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
    users: [{userID: 12, firstName: "Jack", lastName: "Dawson"}, {userID: 12, firstName: "Jack", lastName: "Dawson"},
      {userID: 12, firstName: "Jack", lastName: "Dawson"}, {userID: 12, firstName: "Jack", lastName: "Dawson"},
      {userID: 12, firstName: "Jack", lastName: "Dawson"}, {userID: 12, firstName: "Jack", lastName: "Dawson"},
      {userID: 12, firstName: "Jack", lastName: "Dawson"}, {userID: 12, firstName: "Jack", lastName: "Dawson"},
    ],
    rooms: [{roomID: 1, typeRoom: "Open", chatUserID: 12}, {roomID: 2, typeRoom: "Open", chatUserID: 12},
      {roomID: 3, typeRoom: "Open", chatUserID: 12},
    ],
    messages: [{messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 1, senderID: 10, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack"},
      {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 1, senderID: 10, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack"},
      {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 1, senderID: 10, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack"},
      {messageID: 33, roomID: 1, senderID: 10, text: "Hey, how are you?", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 1, senderID: 10, text: "I'm fine, thanks", time: "12/07/17", senderName: "Jack"},

      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 2, senderID: 10, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom"},
      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 2, senderID: 10, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom"},
      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 2, senderID: 10, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom"},
      {messageID: 33, roomID: 2, senderID: 10, text: "Hi, my name is Tom", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 2, senderID: 10, text: "London is a capital of Great Britain", time: "12/07/17", senderName: "Tom"},

      {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 3, senderID: 10, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon"},
      {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 3, senderID: 10, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon"},
      {messageID: 33, roomID: 3, senderID: 10, text: "I am from Canada", time: "12/07/17", senderName: "Sultan"},
      {messageID: 33, roomID: 3, senderID: 10, text: "I am a CEO of SpaceX and Tesla", time: "12/07/17", senderName: "Elon"},
    ],
    userAccount: {accountID: 10, name: "Sultan"}
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
    getRoomObj: function (state) {
      return state.rooms[3];
    },
    getMessages: (state) => (id) => {
      console.log("getMessages");
      console.log(id);
      //return state.messages.find(message => message.roomID === id);
      var mes = [];
      // state.messages.forEach(function (message) {
      //   if (message.roomID === id) mes.push(message);
      // });
      //mes.push({messageID: 33, roomID: 2, senderID: 10, text: "Hey, how are you?", time: "12/07/17"});
      for (var i = 0; i < state.messages.length; i++) {
        if (state.messages[i].roomID == id) mes.push(state.messages[i]);
      }
      return mes;
    },
    getUser: function (state) {
      return state.userAccount;
    }
  },
  actions: {
    setUser({commit}, query) {
      commit('set', {type: 'user', items: query})
    },

    setMessage({commit}, query) {
      commit('push', {type: 'messages', items: query})
    },

  }
})


// this.$store.dispatch('setUser', response.userObject)
