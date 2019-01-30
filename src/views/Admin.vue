<template>
  <div>
    <v-card v-for="channel in adminChannels" :key="channel.id" style="width: 95%; margin: 0 auto;">
      <v-card-title primary-title>
        <span style="position: relative; left: 90%; z-index: 200; color: blue; cursor: pointer;" @click="editMode ? editMode = false : editMode = true;">edit</span>
        <h3 class="headline mb-0">{{ channel.information.channelName }}</h3>
      </v-card-title>
       <v-list two-line>
        <v-list-tile v-for="member in channel.information.members" :key="member">
          <v-list-tile-avatar v-if="memberDetails[channel.id][member]">{{ getInitials(memberDetails[channel.id][member]) }}</v-list-tile-avatar>
          <v-list-tile-content>
            <!-- Look into the watch variable that sets the memberDetails object to see why this makes sense. -->
            <v-list-tile-title >{{ memberDetails[channel.id][member] }}
              <v-btn flat icon color="red" v-if="editMode" @click="manageUsers()" style="margin: 0;">
                <v-icon>cancel</v-icon>
              </v-btn>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
    <v-card v-if="information">
      <v-card-title primary-title>
        Pending Approval
      </v-card-title>
      <div v-if="information.pendingApproval">
        <div v-for="message in this.pendingApproval" :key="message.content">
          <p>Intended for: {{ message.recipientName }}</p>
          <p>Content: {{ message.content }}</p>
          <p>Sent At: {{ message.timestamp.seconds }}</p>
          <v-btn @click="processMessage(message, true)">Approve</v-btn>
          <v-btn>Reject</v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import firebase from 'firebase';
import permissions from '../permissions';

export default {
  data() {
    return {
      adminChannels: [],
      memberDetails: {},
      editMode: false,
      pendingApproval: [],
      childInfo: {},
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
      // map the channelId array returned from admin.
      val.map(channelId => {
        // hit up firebase for every channel returned
        firebase.firestore()
          .collection('channels')
          .doc(channelId)
          .get()
          .then(channelInformation => {

            // and add any relevant channel data.
            this.adminChannels.push({
              id: channelId,
              information: channelInformation.data()
            });
          });
      });
    },
    // now we watch the adminChannels data in order to get member details downloaded to the channel.
    adminChannels: function(val) {
      // map each channel in the array
      val.map(channel => {
        // set a member details property with the same id as this channel and declare it with an empty object.
        this.$set(this.memberDetails, channel.id, {});

        // map the channels memberIDs
        channel.information.members.map(memberId => {
          // hit up the database
          firebase
            .firestore()
            .collection('userDetails')
            .doc(memberId)
            .get()
            .then(userDetail => {
              // and set the channelID property of user details object with the memberID and their corresponding name.
              this.$set(
                this.memberDetails[channel.id],
                memberId, 
                userDetail.data().username
              );
            })
        });
      })
    },
    information(val) {
      val.pendingApproval.map(commentID => {
        firebase.firestore()
          .collection('messages')
          .doc(commentID)
          .get()
          .then(comment => {
            this.pendingApproval.push(comment.data());
          })
          .catch(err => console.log({err}));
      });

      val.parentFor.map(childID => {
        firebase.firestore()
          .collection('userDetails')
          .doc(childID)
          .get()
          .then(childInfo => {
            this.$set(this.childInfo, childInfo.data().username, childInfo.id);
          })
          .catch(err => console.log({err}));
      });
    }
  },
  methods: {
    // just a bit of fun. Generates simple initials for usernames. 
    getInitials(name) {
      const firstLast = name.split(' ');
      return `${firstLast[0].charAt(0)}${firstLast[1].charAt(0)}`;
    },

    // allows admin to manage user access to chat channels. 
    manageUsers() {

    },
    // This should take a message and create a new connection pipeline between the users in question. 
    processMessage(message, approval) {
      // if I approve the connection.
      if (approval === true) {
        // I create a new channel
        firebase.firestore()
          .collection('channels')
          .add({
            // the channel name will have to consist of member names or else be initialized as null
            channelName: '',
            // the members of this channel can be the recipient and the sender, eg, the original sender and your child, and then optionally yourself as well. 
            members: [this.childInfo[message.recipientName], message.sender, this.$store.state.user],
            // and the thread should be initialized with an opening message being this message. 
            thread: [message]
          })
          .then(newChannel => {
              // now we need enable permissions for everyone.
              const users = [this.childInfo[message.recipientName], message.sender, this.$store.state.user];

              // adds the channel to each user's permissions array.
              users.map(user => {
                firebase.firestore()
                  .collection('userDetails')
                  .doc(user)
                  .update({
                    channels: firebase.firestore.FieldValue.arrayUnion(newChannel.id)
                  });
              });

              // additionally adds the id to the parent's admin permissions.
              firebase.firestore()
                .collection('userDetails')
                .doc(users[2])
                .update({
                  adminFor: firebase.firestore.FieldValue.arrayUnion(newChannel.id)
                });
          });
        // with that done, should the message just be deleted from the pending collection? Do we really need to store them anywhere other than in approved threads? 
      }
    },
  },
  mounted() {
    permissions.openChannel({
      message: "5LkOXtiUPzvEAyt9Utgh",
      channelType: 1,
      members: ["Jack", "Adam"]
    }, (res, err) => {
      if (err) throw err;
      console.log(res);
    })
  }
}
</script>

<style>

</style>

