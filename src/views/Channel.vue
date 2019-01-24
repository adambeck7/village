<template>
  <div v-if="channelData">
    <h1>{{ channelData.channelName }}</h1>
    
    <div>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-list two-line>
              <div v-for="message in channelData.thread" :key="message.content">
                <v-list-tile>
                  <v-list-tile-content :class="{ myMessage: (users[message.sender] ===  information.username )}">
                    <v-list-tile-sub-title>{{ users[message.sender] }}</v-list-tile-sub-title>
                    <v-list-tile-title :class="{ myMessage: (users[message.sender] ===  information.username )}">
                      {{ message.content }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
              </div>
            </v-list>
          </v-flex>
          <v-flex xs12>
            <v-textarea
              :auto-grow="true"
              solo
              append-icon="send"
              v-model="message"
              @click:append="sendMessage()"
            >
              <v-icon>home</v-icon>
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
  <div v-else>No Access.
  </div>
</template>

<script>
import db from 'firebase';
// This is the channel view page. We get the id from the query params. We need to do a couple of things: 
// 1. Render a 404 if the channel does not exist.
// 2. Render a 401 if the user cannot view the channel, eg, doesn't have permissions.
// 3. Render the channel if everything's good. 
export default {
  data() {
    return {
      message: null,
      channelData: null,
      users: {},
    }
  },
  computed: {
    information() { 
      return this.$store.getters.userInformation; 
    }
  },
  watch: {
    information: function(val) {
      if (this.channelData === null) {
        this.information.channels.map(channelId => {
          if (channelId === this.$route.params.channelId) {
            db.firestore()
              .collection('channels')
              .doc(channelId)
              .onSnapshot(doc => {
                this.channelData = doc.data();
              });
          }
        })
      }
    }
  },
  methods: {
    sendMessage() {
      this.channelData.thread.push({
        content: this.message,
        sendTime: new Date(),
        sender: this.$store.state.user
      });
      this.message = "";
      db.firestore()
        .collection("channels")
        .doc(this.$route.params.channelId)
        .update({
          thread: this.channelData.thread
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    db.firestore()
      .collection('channels')
      .doc(this.$route.params.channelId)
      .get()
      .then(res => {
        const members = res.data().members;
        members.map(member => {
          db.firestore()
            .collection('userDetails')
            .doc(member)
            .get()
            .then(memberDetails => {
              this.users[member] = memberDetails.data().username;
            });
        });
      });
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

  .myMessage {
    text-align: right;
  }
</style>
