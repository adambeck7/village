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
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      adminChannels: [],
      memberDetails: {},
      editMode: false,
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

    }
  }
}
</script>

<style>

</style>

