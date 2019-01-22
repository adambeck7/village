<template>
  <div>
    <h2>Hello!</h2>
    <label for="proposedChannel"></label>
    <select name="proposedChannel" id="proposedChannel" v-model="proposedChannel">
      <option 
        v-for="channel in channels"
        :key="channel.id"
        :value="channel.id">
          {{ channel.name }}
      </option>
    </select>
    <label for="comment"></label>
    <textarea name="comment" v-model="message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import db from "firebase"
export default {
  data() {
    return {
      greeting: 'hello!',
      channels: [],
      message: null,
      proposedChannel: null,
    }
  },
  methods: {
    // trying to send the message into pending data.
    sendMessage() {
      db.firestore()
        .collection('messages')
        .add(this.messagePacket)
        .catch(err => console.log({err}));
    }
  },
  computed: {
    // data packet that goes to the db. 
    messagePacket() {
      return {
        proposedChannel: this.proposedChannel,
        message: this.message,
        // just hard coding this, ultimately it should come straight from vuex.
        senderID: '111',
        // this cannot hapen on the front end. 
        approval: false,
        channel: null
      }
    }
  },
  beforeMount() {
    console.log(this.$store.state.user);
    db.firestore()
      .collection('channels')
      .get()
      .then(res => {
        res.docs.forEach(channel => {
          this.channels.push({
            name: channel.data().channelName,
            id: channel.id
          });
        });
      })
      .catch(err => console.log({err}));
  }
}
</script>

<style>

</style>
