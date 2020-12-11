<template>
  <v-app class="parent">
    <div class="appName">Kotak Saran ITB</div>
    <div class="appTagline">Silahkan salurkan aspirasimu</div>
    <div class="googleButtonLoginContainer">
      <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess" :onFailure="onFailure"></GoogleLogin>
    </div>
  </v-app>
</template>

<script>
// @ is an alias to /src
import GoogleLogin from 'vue-google-login';

export default {
  name: 'Home',
  components: {
    GoogleLogin
  },
  data() {
    return {
      params: {
        client_id: "330024727316-juvqj3610umqh8c27p6ntduh2bd5ra16.apps.googleusercontent.com"
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      },
      // name: 'hehe'
    }
  }, 
  methods: {
    async onSuccess(response) {
      console.log('success')
      var idToken = response.getAuthResponse().id_token
      await this.$axios.post('login', {
        idToken: idToken
        }).then((res) => {
          console.log(JSON.stringify(res.data));
          this.$store.commit('setUser', res.data)
        }).catch((err) => {
          console.log(err)
        }
      )
      // this.name = this.$store.state.user;
      this.$router.push({name: 'Saran'})
    },
    onFailure() {
      console.log('fail')
    }
  },
  async created() {
    if (this.$store.getters.getUser.uid !== null) {
      this.$router.push({name: 'Saran'})
    } 
  }
}
</script>

<style scoped>
.parent {
  background: #afddd0;
}
.appName {
  font-size: 30px;
  text-align: center;
  margin: 20px 0 0 0;
  font-family: 'Ubuntu';
  color: #101424;
  font-weight: bold;
}
.appTagline {
  font-size: 13px;
  text-align: center;
  color: #101424;
  margin-bottom: 20px;
  font-family: 'Ubuntu'
}
.googleButtonLoginContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>