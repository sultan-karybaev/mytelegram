import Vue from 'vue'
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
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
    updateRoomProfile(state, roomProfile){
      for (let i = 0; i < state.roomProfiles.length; i++) {
        if (state.roomProfiles[i]._id == roomProfile._id) {
          if (state.roomProfiles[i].index != 1) {
            for (let j = 0; j < state.roomProfiles.length; j++) {
              state.roomProfiles[j].index++;
            }
          }
          state.roomProfiles[i].roomID.lastMessageText = roomProfile.roomID.lastMessageText;
          state.roomProfiles[i].roomID.lastMessageTime = roomProfile.roomID.lastMessageTime;
          state.roomProfiles[i].roomID.memberCount = roomProfile.roomID.memberCount;

          state.roomProfiles[i].unreadMessageCount = roomProfile.unreadMessageCount;
          state.roomProfiles[i].index = roomProfile.index;
          state.roomProfiles[i].name = roomProfile.name;
          state.roomProfiles[i].img = roomProfile.img;
          state.roomProfiles[i].admin = roomProfile.admin;
          if (roomProfile.member && !state.roomProfiles[i].member) {
            if (state.roomProfiles[i].chosen) {
              Event.$emit("Store-to-Sidebar-enterRoom", roomProfile.roomID._id);
            } else {
              for (let i = 0; i < state.allMessageArray.length; i++) {
                if (state.allMessageArray[i].roomID == roomProfile.roomID._id) state.allMessageArray.splice(i, 1);
              }
            }
          }
          state.roomProfiles[i].chosen = roomProfile.chosen;
          state.roomProfiles[i].member = roomProfile.member;
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
      let user = {_id: -1};
      let messageParams;
      let currentIndex = -1;
      let date = -1;
      let months = ["January", "February", "Mart", "April", "May", "June", "Jule", "August", "September", "October", "November", "December"];

      console.log("3333", state.allMessageArray)

      for (let i = 0; i < state.allMessageArray.length; i++) {
        if (state.allMessageArray[i].roomID == id) {
          let messages = state.allMessageArray[i].messages;
          for (let j = 0; j < messages.length; j++) {
            if (date !== new Date(messages[j].time * 2 / 2).getDate()) {
              currentIndex++;
              date = new Date(messages[j].time * 2 / 2).getDate();
              array.push({
                messageType: "Time",
                messageTime: date + " " + months[new Date(messages[j].time * 2 / 2).getMonth()] + " " + new Date(messages[j].time * 2 / 2).getFullYear()
              });
              j--;
              user = {_id: -1};
            } else {
              messageParams = {
                messageID: messages[j]._id,
                text: messages[j].text,
                src: messages[j].src,
                time: messages[j].time,
                type: messages[j].type,
                secondPerson: messages[j].secondPerson
              };

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
    updateRoomProfileMainjs({commit}, roomProfile) {
      commit('updateRoomProfile', roomProfile)
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
      console.log("setMessagesLoginSidebarvue");
      commit('push', {type: 'allMessageArray', items: query})
    },
    setRoomChosenChatSidebarvue({commit}, query) {
      commit('setRoomChosen', query)
    }
  }
})


// this.$store.dispatch('setUser', response.userObject)
