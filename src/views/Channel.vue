<template>
  <div v-if="channelData">
    <div>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <!-- migrating from vuetify to a little custom css. -->
            <div id="chat-area">
              <div
                class="message"
                v-for="message in channelData.thread"
                :key="message.content"
                :class="{ userMessage: (users[message.sender] === information.username) }"
              >
                <h4
                  class="message-sender"
                  :class="{ myMessage: (users[message.sender] ===  information.username )}"
                >{{ users[message.sender] }}</h4>
                <p
                  class="message-content"
                  :class="{ myMessage: (users[message.sender] ===  information.username )}"
                >{{ message.content }}</p>
              </div>
            </div>
            <!-- <v-list three-line id="chat-area">
              <div v-for="message in channelData.thread" :key="message.content">
                <v-list-tile>
                  <v-list-tile-content :class="{ myMessage: (users[message.sender] ===  information.username )}">
                    <v-list-tile-sub-title>{{ users[message.sender] }}</v-list-tile-sub-title>
                    <p :class="{ myMessage: (users[message.sender] ===  information.username )}">
                      {{ message.content }}
                    </p>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
              </div>
            </v-list>-->
          </v-flex>
          <v-flex xs12>
            <v-textarea
              :auto-grow="true"
              outline
              append-icon="send"
              v-model="message"
              @click:append="sendMessage($event)"
              @keydown="sendMessage($event)"
              @keyup="unshift($event)"
              style="z-index: 0;"
            >
              <v-icon>home</v-icon>
            </v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
  <div v-else>
    <div class="text-xs-center">
      <v-progress-circular
        indeterminate
        color="#55ab59"
        style="height: 10em; width: 10em; margin-top: 10em;"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import db from "firebase";

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
      firstUpdate: true,
      shifted: false
    };
  },
  computed: {
    information() {
      return this.$store.getters.userInformation;
    }
  },
  watch: {
    // a watcher function for information change, this function serves as the gateway for content. If the uid isn't discovered
    information: function(val) {
      if (this.channelData === null) {
        this.information.channels.map(channelId => {
          if (channelId === this.$route.params.channelId) {
            db.firestore()
              .collection("channels")
              .doc(channelId)
              .onSnapshot(doc => {
                if (doc.data().members.includes(this.$store.state.user)) {
                  this.channelData = doc.data();
                } else {
                  window.location.replace("/home");
                }
              });
          }
        });
      }
    }
  },
  methods: {
    // checker for shift button being held down to permit new lines.
    unshift(e) {
      if (e.keyCode === 16) this.shifted = false;
    },
    processMessage() {
      // makes the local change to the thread creating a new message with the sender's uid and a date object attached to it.
      this.channelData.thread.push({
        content: this.message,
        sendTime: new Date(),
        sender: this.$store.state.user,
        senderName: this.$store.state.information.username
      });

      // clears the content of the text area.
      this.message = "";

      // makes the change to the database.
      db.firestore()
        .collection("channels")
        .doc(this.$route.params.channelId)
        .update({
          thread: this.channelData.thread
        })
        .catch(err => console.log({ err }));

      // runs a DOM-based call to attempt to keep scroll at the bottom of the chat area div (not currently working.)
      const chatArea = document.getElementById("chat-area");
      chatArea.scrollTop = chatArea.scrollHeight;
      console.log("chatArea", chatArea);
    },
    sendMessage(e) {
      // if the event passed to this function is a keyboard event

      if (e.keyCode === 16) this.shifted = true;

      if (e instanceof KeyboardEvent) {
        // if (e.keyCode === 13 && this.shifted) {
        //   console.log(this.message);
        // }
        // if the enter button is pressed while the shift key is not being held down...
        if (e.keyCode === 13 && !this.shifted) {
          // prevent the default behavior in the text area of creating a new line.
          e.preventDefault();

          // add the comment to the thread.
          this.processMessage();
        }
      } else {
        // happens when the button is clicked instead of enter. The click function doesn't need to worry about key codes or preventing defaults.
        this.processMessage();
      }
    }
  },
  mounted() {
    db.firestore()
      .collection("channels")
      .doc(this.$route.params.channelId)
      .get()
      .then(res => {
        if (res.data().members.includes(this.$store.state.user)) {
          const members = res.data().members;
          members.map(member => {
            db.firestore()
              .collection("userDetails")
              .doc(member)
              .get()
              .then(memberDetails => {
                this.users[member] = memberDetails.data().username;
              });
          });
        } else {
          // if the user is not a member of the channel, they are rerouted and no firebase data is sent to their browser.
          window.location.replace("/home");
        }
      });
  },
  updated() {
    if (this.firstUpdate) {
      const chatArea = document.getElementById("chat-area");
      chatArea.scrollTop = chatArea.scrollHeight;
      this.firstUpdate = false;
    } else {
      const chatArea = document.getElementById("chat-area");
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }
};
</script>

<style>
#header {
  padding: 1em;
  border-bottom: 0.1em lightgray solid;
}

#chat-area {
  /* max-height: 29em; */
  height: 29em;
  overflow-y: scroll;
}

.userMessage {
  margin-left: 40%;
  /* background-color: #55ab59 !important; */
  columns: #fefefe;
  background: -webkit-linear-gradient(
    360deg,
    #00537e 10%,
    #3aa17e 360%
  ) !important;
  background: linear-gradient(360deg, #00537e 10%, #3aa17e 360%) !important;
}

.message {
  padding: 1em;
  /* background-color: #368cbf; */
  background: -webkit-linear-gradient(
    360deg,
    #38aecc 10%,
    #347fb9 360%
  ); /* Chrome 10+, Saf5.1+ */
  background: -moz-linear-gradient(
    360deg,
    #38aecc 10%,
    #347fb9 360%
  ); /* FF3.6+ */
  background: linear-gradient(360deg, #38aecc 10%, #347fb9 360%); /* W3C */

  border-radius: 0.5em;
  /* border: 0.1em #55ab59 solid; */
  margin-bottom: 1em;
  max-width: 60%;
  color: #fefefe;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.message-sender {
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
.myMessage {
  text-align: right;
}
.message-content {
  text-align: left;
  font-size: 1.3em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
