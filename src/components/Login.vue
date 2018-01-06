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


  </div>
</template>


<script>
  export default
  {
    name: 'Login',
    data() {
      return {
        countryCode : '+7',
        phoneNumber: ''
      }
    },
    computed: {
      systemEntry() {
        return this.$store.getters.getExistingUserAccount;
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
        console.log(response);
        this.$store.dispatch('setUserAccount', response);
        this.$router.push({ name: 'contact', params: { chatID: 1 }});
        this.$socket.emit("login-Login.vue-Server", this.phoneNumber);
      }
    },
    mounted() {

    }
  }
</script>





<style>


</style>
