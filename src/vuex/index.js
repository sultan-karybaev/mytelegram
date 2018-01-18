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
    roomProfiles: [],
    allMessageArray: [],
    userAccount: {}
  },
  mutations: {
    set(state, {type, items}){
      state[type] = items
    },
    push(state, {type, items}){
      state[type].push(items);
    },
    pushMessage(state, message){
      for (let i = 0; i < state.allMessageArray.length; i++) {
        if (state.allMessageArray[i].roomID == message.roomID) {
          state.allMessageArray[i].messages.push(message);
        }
      }
      Event.$emit("Store-to-Contact-pushMessage");
    },
    setLastMessage(state, room){
      for (let i = 0; i < state.roomProfiles.length; i++) {
        if (state.roomProfiles[i].roomID._id == room._id) {
          state.roomProfiles[i].roomID.lastMessageText = room.lastMessageText;
          state.roomProfiles[i].roomID.lastMessageTime = room.lastMessageTime;
          if (state.roomProfiles[i].index !== 1) {
            for (let j = 0; j < state.roomProfiles.length; j++) {
              state.roomProfiles[j].index++;
            }
            state.roomProfiles[i].index = 1;
          }
          if (!state.roomProfiles[i].chosen) state.roomProfiles[i].unreadMessageCount++;
        }
      }
      Event.$emit("Store-to-Sidebar-lastMessage");
    },
    pushRoomEmit(state, {type, items}) {
      console.log("pushRoomEmit");
      for (let i = 0; i < state.roomProfiles.length; i++) {
        state.roomProfiles[i].index++;
        state.roomProfiles[i].chosen = false;
      }
      state[type].push(items);
    },
    pushRoomBroadcast(state, {type, items}) {
      console.log("pushRoomBroadcast");
      for (let i = 0; i < state.roomProfiles.length; i++) {
        state.roomProfiles[i].index++;
      }
      state[type].push(items);
    },
    setRoomChosen(state, roomID) {
      for (let i = 0; i < state.roomProfiles.length; i++) {
        if (state.roomProfiles[i]._id !== roomID) {
          state.roomProfiles[i].chosen = false;
        } else {
          state.roomProfiles[i].chosen = true;
          state.roomProfiles[i].unreadMessageCount = 0;
        }
      }
      console.log(state.roomProfiles);
    }
  },
  getters: {
    getRooms: function (state) {
      state.roomProfiles.sort(function (a, b) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      });
      return state.roomProfiles;
    },
    getContacts: function (state) {
      return state.users;
    },
    getMessages: (state) => (id) => {
      let array = [];
      let user = {
        _id: 0
      };
      let messageParams;
      let currentIndex = -1;

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
              secondPerson: messages[j].secondPerson
            };

            //console.log(senderID !== state.messages[i].senderID);
            if (messages[j].type == "System") {
              user = {_id: 0};
              currentIndex++;
              array.push({
                profile: messages[j].profileID,
                messageType: messages[j].type,
                messageArray: [messageParams]
              });
            } else if (user._id !== messages[j].profileID._id) {
              user = messages[j].profileID;
              currentIndex++;
              array.push({
                profile: messages[j].profileID,
                messageType: messages[j].type,
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
    getMessegesTest: function (state) {
      return state.allMessageArray;
    },
    getUser: function (state) {
      return state.userAccount;
    },
    getExistingUserAccount: (state) => {
      if (state.userAccount.userID) return true;
      else return false;
    },
    getRoomProfile: (state) => (roomID) => {
      for (let i = 0; i < state.roomProfiles.length; i++) {
        if (state.roomProfiles[i].roomID._id == roomID) return state.roomProfiles[i];
      }
    },
    getHasRoomBeenOpened: (state) => (roomID) => {
      for (let i = 0; i < state.allMessageArray.length; i++) {
        if (state.allMessageArray[i].roomID == roomID) return true
      }
      return false;
    }
  },
  actions: {
    //Example
    setUserExample({commit}, query) {
      commit('set', {type: 'user', items: query})
    },
    setMessageMainjs({commit}, message) {
      commit('pushMessage', message)
    },
    setLastMessageMainjs({commit}, room) {
      commit('setLastMessage', room)
    },
    setNewRoomEmitMainjs({commit}, query) {
      commit('pushRoomEmit', {type: 'roomProfiles', items: query})
    },
    setNewRoomBroadcastMainjs({commit}, query) {
      commit('pushRoomBroadcast', {type: 'roomProfiles', items: query})
    },
    setUserAccountLoginvue({commit}, query) {
      commit('set', {type: 'userAccount', items: query})
    },
    setContactsLoginvue({commit}, query) {
      commit('set', {type: 'users', items: query})
    },
    setRoomsLoginvue({commit}, query) {
      commit('set', {type: 'roomProfiles', items: query})
    },
    setMessagesLoginSidebarvue({commit}, query) {
      commit('push', {type: 'allMessageArray', items: query})
    },
    setRoomChosenChatSidebarvue({commit}, query) {
      commit('setRoomChosen', query)
    }
  }
})


// this.$store.dispatch('setUser', response.userObject)
