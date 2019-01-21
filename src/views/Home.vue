
<template>
  <div class="home">
    <img class="home-logo" alt="Village logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Village"/>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
export default {
  name: "home",
  components: {
    HelloWorld
  },
  data() {
    return {
      uid: "",
      email: "",
      displayName: "",
      active: false
    };
  },
  created: function() {
    this.db = firebase.auth().currentUser;
    this.uid = this.db.uid;
    this.email = this.db.email;
    this.displayName = this.db.displayName;
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    }
  }
};
</script>

<style>
.home-logo {
  max-width: 10em;
}
</style>
