<template>
  <div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      adminChannels: []
    }
  },
  computed: {
    // pulling user settings from the VUEX store.
    information() {
      return this.$store.state.information;
    },
    // using user settings to generate admin for information. 
    admin() {
      if (this.information) {
        if (this.information.adminFor.length > 0) {
          return this.information.adminFor;
        } else {
          return null;
        }
      }
    },
    // here it gets a wee bit complicated. We're going to look through the channels in the lists and return ONLY the users arrays. 
  },
  watch: {
    // watching for computed admin check to run any db call.
    admin: function(val) {
      val.map(channelId => {
        firebase.firestore()
          .collection('channels')
          .doc(channelId)
          .get()
          .then(channelInformation => {
            this.adminChannels.push(channelInformation.data());
          })
          .catch(error => console.log({error}));
      });
    }
  }
}
</script>

<style>

</style>

