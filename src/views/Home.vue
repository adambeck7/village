
<template>
  <div class="home">
    <Compose/>
    <br>
    <HelloWorld/>
  </div>
</template>

<script>
import firebase from "firebase";
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Compose from "@/components/Compose.vue";
export default {
  name: "home",
  components: {
    HelloWorld,
    Compose
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
  }
};
</script>

<style>
</style>
