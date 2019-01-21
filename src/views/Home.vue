
<template>
  <div class="home">
    <HelloWorld msg="My Village"/>
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
  }
};
</script>

<style>
</style>
