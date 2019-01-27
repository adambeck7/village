<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 md3>
        <v-text-field
          label="Send to..."
          box
          placeholder="Search Users"
          v-model="searchName"
        >
        </v-text-field>
        <p v-for="user in returnedUsers" :key="user.username" style="color: #55ab59; cursor: pointer;" @click="selectedUser = user">{{ user.username }}</p>
      </v-flex>
      <v-flex xs12 sm6 md3 v-if="selectedUser">
        <v-textarea
          solo 
          name="message"
          label="message"
          placeholder="enter message here"
          v-model="message"
        >
        </v-textarea>
        <v-btn color="#55ab59" text="white" @click="sendMessage">Send</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      searchName: '',
      users: [],
      returnedUsers: [],
      selectedUser: null,
      message: '',
    }
  },
  watch: {
    searchName(val) {
      this.returnedUsers = this.users.filter(user => user.username.includes(val));
    }
  },
  methods: {
    // here's where the work will happen to send a message. 
    sendMessage() {

      firebase.firestore()
        .collection('messages')
        // we add a message with the pertinent details.
        .add({
          sender: this.$store.state.user,
          content: this.message,
          timestamp: new Date(),
          recipientID: this.selectedUser.uid,
          recipientName: this.selectedUser.username,
        })
        .then(resolves => {
          this.message = "";
          
          // let's try to run this here.
          if (Array.isArray(this.selectedUser.uid)) {
            this.selectedUser.uid.map(guardianID => {

              firebase.firestore()
                .collection('userDetails')
                .doc(guardianID)
                .update({
                  pendingApproval: firebase.firestore.FieldValue.arrayUnion(resolves.id)
                })
                .catch(err => console.log({err}));
            });
          }
        })
        .catch(err => console.log({err}));
    }
  },
  mounted(){
    // get all username/uid pairs on mount for now. Ultimately it'd be cool if there were broad circles a la nextDoor and we could set it up so that you can only search for users within your broad circle. 
    firebase.firestore()
      .collection('userDetails')
      .get()
      .then(result => {
        result.forEach(user => {
          // if the user is a child, you get only the parent's ref id array. That way, a stranger / unapproved user has no access to a child's user account id. 
          if (user.data().userType === 1) {
            this.users.push({
              uid: user.data().guardians,
              username: user.data().username
            });
          } else {
            this.users.push({
              uid: user.id,
              username: user.data().username
            });
          }
        });
      });
  }
}
</script>

<style>

</style>
