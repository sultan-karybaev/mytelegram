<template>
  <div id="app">


    <facebook-account-kit ref="accountKit"
                          appId="193014614575624"
                          version="v1.0"
                          :fbAppEventsEnabled='true'
                          :debug='true'
                          state="somecrsf"   v-if="systemEntry">
      <input value="+1" id="country_code" v-model="countryCode" />
      <input placeholder="phone number" id="phone_number" v-model="phoneNumber"/>
      <button @click="login(countryCode, phoneNumber)">Login via SMS</button>
    </facebook-account-kit>

    <div style="margin: 30px 0">
      <input type="number" placeholder="Your phonenumber" v-model="testPhone"/>
    </div>

    <div>
      <input type="password" placeholder="Your password" v-model="testPassword"/>
    </div>

    <button style="margin: 30px 0" @click="testLogin(testPhone, testPassword)">Log in</button>

  </div>
</template>


<script>
  import axios from 'axios'

  export default
  {
    name: 'Login',
    data() {
      return {
        countryCode : '+7',
        phoneNumber: '',

        testPhone: "",
        testPassword: ""
      }
    },
    computed: {
      systemEntry() {
        return !this.$store.getters.getExistingUserAccount;
      }
    },
    methods: {
      login (countryCode, phoneNumber) {
        console.log(this.$refs);
        this.$refs.accountKit.login({
          countryCode: countryCode,
          phoneNumber: phoneNumber,
          display: 'modal'}, this.loginCallback)
      },
      loginCallback (response) {
        console.log(this.phoneNumber);
        response.userID = this.phoneNumber;
        console.log("response", response);
        this.$store.dispatch('setUserAccount', response);
        this.$router.push({ name: 'Chat'});
        this.$socket.emit("login-Login.vue-Server", this.phoneNumber);
      },
      testLogin(testPhone, testPassword) {
        if (testPhone && testPassword) {
          console.log("Login");
          const vm = this;
          let data = {
            phone: testPhone,
            password: testPassword
          };
          axios.post("http://localhost:3000/post/login", data)
            .then(function (res) {
              console.log(res);
              vm.$socket.emit("login-Login.vue-Server", res.data);
              vm.$store.dispatch('setUserAccountLoginvue', res.data);

              axios.get("http://localhost:3000/get/contacts/" + res.data._id)
                .then(res => vm.$store.dispatch('setContactsLoginvue', res.data))
                .catch(err => console.log(err));

              axios.get("http://localhost:3000/get/rooms/" + res.data._id)
                .then(function (res) {
                  for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].chosen) {
                      axios.get("http://localhost:3000/get/messages/" + res.data[i]._id)
                        .then(res => vm.$store.dispatch('setMessagesLoginSidebarvue', res.data))
                        .catch(err => console.log(err));
                      break;
                    }
                  }
                  vm.$store.dispatch('setRoomsLoginvue', res.data)
                })
                .catch(err => console.log(err));

              setTimeout(() => vm.$router.push({ name: 'Chat'}), 300)
            })
            .catch(err => console.log(err));
        }
      }
    },
    mounted() {

    }
  }
</script>





<style>


</style>
