<template>
  <div v-if="channelData">
    <h1>{{ channelData.channelName }}</h1>
    {{ userInformation.channels }}
    <div id="chat-area">

    </div>
    <textarea id="compose-message" v-model="message" @keydown="sendMessage($event)"></textarea>
  </div>
  <div v-else>No Access. {{ userInformation.channels }}
    
  </div>
</template>

<script>
import db from 'firebase';
import { mapGetters } from 'vuex';
// This is the channel view page. We get the id from the query params. We need to do a couple of things: 
// 1. Render a 404 if the channel does not exist.
// 2. Render a 401 if the user cannot view the channel, eg, doesn't have permissions.
// 3. Render the channel if everything's good. 
export default {
  data() {
    return {
      channelData: null,
      message: null,
    }
  },
  computed: {
    ...mapGetters([
      'userInformation'
    ])
  },
  methods: {
    sendMessage(e) {
      console.log({e})
      if (e.keyCode === 13) console.log({e});
    }
  },
   mounted() {
    // we're having issues recognizing the state change. This will have to be addressed.
    // const state = await this.$store.state;
    // console.log(state);
    // // Here, we loop through the channels the user has permissions for and see if we get a match. If we do, we return render code 1. 
    // state.information.channels.map(channelID => {
    //   // if we get a match, we return 1 because we're aok to access the chat. 
    //   console.log(`Looping through channels; currently at ${this.$route.params.channelId} and comparing it with ${channel}`)
    //   if ( this.$route.params.channelId === channelID) {
    //     // if the check is valid we hit up the firestore and grab the chat data. 
    //     db.firestore()
    //       .collection('channels')
    //       .doc(channelID)
    //       .get()
    //       .then(res => this.channelData = res.data())
    //       .catch(err => console.log({err}));

    //     return 1;
    //   } else {
    //     console.log(0);
    //     // here we need to just plain reroute right out the gate to keep the channel completely inaccessible to outsiders. 
    //   }
    // });
  }
}
</script>

<style>
  #chat-area {
    width: 95%;
    margin: 0 auto;
    margin-top: .5em;
    height: 10em;
    background-color: #f2f2f2;
    border-radius: 1em 1em 0em 0em;
    border: .5px lightgray solid;
  }

  #compose-message {
    width: 95%;
    margin: 0 auto;
    padding: 2em;
    border: .5px lightgray solid;
  }
</style>
