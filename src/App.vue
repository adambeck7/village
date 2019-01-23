<template>
  <div id="app">
    <div id="nav">
      <v-layout>
        <v-container>
          <v-layout justify-start>
            <!-- <v-btn color="pink" dark @click.stop="drawer = !drawer">Toggle</v-btn> -->
            <v-btn fab dark color="teal" @click.stop="drawer = !drawer">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-layout>
          <img class="home-logo" alt="Village logo" src="./assets/logo.png">
        </v-container>

        <v-navigation-drawer v-model="drawer" temporary absolute dark class="navBackground">
          <v-list class="pa-1">
            <v-list-tile avatar class="avatar-padding">
              <v-list-tile-avatar>
                <img src="./assets/adam_ahern.jpeg">
              </v-list-tile-avatar>
              <!-- <v-avatar color="teal">
                <span class="white--text headline">{{avatar}}</span>
              </v-avatar>-->
              <v-list-tile-content>
                <v-list-tile-title style="padding-left:0.8em">{{ userEmail }}</v-list-tile-title>
                <!-- <v-list-tile-title style="padding-left:0.8em">{{ userEmail }}</v-list-tile-title> -->
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <!-- <v-divider></v-divider> -->
          <!-- <v-list>
            <v-list-tile>
              <v-list-tile-title class="title">Home</v-list-tile-title>
            </v-list-tile>
          </v-list>-->
          <v-list class="pt-0" dense>
            <v-list-tile v-for="item in items" :key="item.title" @click>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-list class="pt-0" dense>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile>
                <v-list-tile-title class="title">Direct Messages</v-list-tile-title>
              </v-list-tile>
            </v-list>

            <v-list-tile v-for="directMessage in directMessages" :key="directMessage.title" @click>
              <v-list-tile-action>
                <v-icon>{{ directMessage.icon }}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ directMessage.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-list class="pt-0" dense>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile>
                <v-list-tile-title class="title">Circles</v-list-tile-title>
              </v-list-tile>
            </v-list>

            <v-list-tile v-for="circle in circles" :key="circle.title" @click>
              <v-list-tile-action>
                <v-icon>{{ circle.icon }}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ circle.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-list>
            <v-btn color="#33363b" @click="logout" class="navLogoutButton">Logout</v-btn>
          </v-list>
        </v-navigation-drawer>
      </v-layout>
      <!-- <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>-->
    </div>
    <router-view/>
    <v-card height="200px" flat>
      <v-bottom-nav :active.sync="bottomNav" :value="true" fixed color="transparent">
        <v-btn color="teal" flat value="home">
          <span>Home</span>
          <v-icon>home</v-icon>
        </v-btn>

        <v-btn color="teal" flat value="mail">
          <span>Mail</span>
          <v-icon>email</v-icon>
        </v-btn>

        <v-btn color="teal" flat value="messages">
          <span>Messages</span>
          <v-icon>chat</v-icon>
        </v-btn>
        <v-btn color="teal" flat value="events">
          <span>Events</span>
          <v-icon>event</v-icon>
        </v-btn>
        <v-btn color="teal" flat value="notifications">
          <span>Notifications</span>
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-btn color="teal" flat value="profile">
          <span>Profile</span>
          <v-icon>settings</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-card>
  </div>
</template>


<script>
import firebase from "firebase";
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: "Home", icon: "home" },
        { title: "Settings", icon: "settings" }
        // { title: "Logout", icon: "mdi-logout" }
      ],
      directMessages: [
        { title: "Dana", icon: "question_answer" },
        { title: "Hannah", icon: "question_answer" },
        { title: "Dillon", icon: "question_answer" },
        { title: "Betsy", icon: "question_answer" },
        { title: "Ella", icon: "question_answer" },
        { title: "Libby", icon: "question_answer" }
        // { title: "Logout", icon: "mdi-logout" }
      ],
      circles: [
        { title: "Channel 1", icon: "dashboard" },
        { title: "Channel 2", icon: "question_answer" }
        // { title: "Logout", icon: "mdi-logout" }
      ],
      userEmail: "adam.c.ahern@gmail.com",
      avatar: null,
      bottomNav: "recent"
    };
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    },
    async getEmail() {
      let userEmail = await firebase.auth().currentUser.email;
      return userEmail;
      // return firebase.auth().currentUser.email;
    }
    // getAvatar: function() {
    //   return firebase.auth().currentUser.email.charAt(0);
    // }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  // padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.home-logo {
  max-width: 10em;
  margin-top: -3em;
}
.avatar-padding > :first-child {
  padding-left: 0 !important;
}
.v-item-group.v-bottom-nav .v-btn {
  max-width: 10em;
  background: white !important;
}
.navBackground {
  background: #0386c1 !important;
}
.navBackground
  > [role="list"]
  > [role="list-item"]
  > .v-list__tile
  > .v-list__tile__content
  > .v-list__tile_title {
  color: red !important;
}
.theme--dark.v-icon {
  color: #eaeaea;
}
</style>

<style scoped>
.v-list__tile__title {
  color: #eaeaea;
}
.navBackground > .v-list {
  padding: 0;
}
.navLogoutButton {
  position: absolute;
  bottom: 1em;
  left: 7em;
  align-content: center;
}
/* .v-list__tile__content {
  padding-left: 1.3em;
} */
</style>

