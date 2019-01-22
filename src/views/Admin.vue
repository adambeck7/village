<template>
  <div>
    <h1>Admin Example</h1>
    <div v-for="message in proposedMessages" :key="message.senderID" style="border: 1px black solid; margin: 20px; padding: 10px;">
      <h3>{{ message.senderID }} says:</h3>
      <!-- this should be content -->
      <p>{{ message.message }}</p>
      <button class="btn" @click="acceptMessage">Accept</button>
      <button class="btn" @click="rejectMessage">Reject</button>
    </div>
  </div>
</template>

<script>
import db from 'firebase';

export default {
  data() {
    return {
      // hardcoding some values until they're passed down from VUEX. In this example I am an admin for the Ryan Family chat channel. 
      channel: 'dgVL9b7woa15bWjuulzk',
      proposedMessages: [],
    }
  },
  methods: {
    acceptMessage() { 
      console.log("Y")
    }, 
    rejectMessage() {
      console.log("N")
    }
  },
  beforeMount() {
    db.firestore().collection('messages')
      .where('proposedChannel', '==', this.channel)
      .get()
      .then(res => {
        res.forEach(proposedMessage => this.proposedMessages.push(proposedMessage.data()));
        console.log(this.proposedMessages);
      })
      .catch(err => console.log({err}));
  }
}
</script>

<style>
  .btn {
    margin: 5px;
    padding: 10px;
    border: 1px gray solid;
    background-color: gainsboro;
  }
</style>
