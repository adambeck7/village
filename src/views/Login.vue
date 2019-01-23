<template>
  <div class="login">
    <!-- <img class="home-logo" alt="Village logo" src="../assets/logo.png"> -->
    <v-container grid-list-md text-xs-center>
      <h3>Sign In</h3>
      <v-form ref="form" lazy-validation>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'visibility_off' : 'visibility'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>

          <!-- <v-checkbox
            v-model="checkbox"
            :rules="[v => !!v || 'You must agree to continue!']"
            label="Do you agree?"
            required
          ></v-checkbox>
           //for btn :disabled="!valid"
          -->
          <v-btn dark color="#55ab59" @click="login">Login</v-btn>
          <p>Don't have an account ? You can
            <router-link to="/sign-up">create one</router-link>
          </p>
        </v-flex>
      </v-form>
    </v-container>
    <!-- <v-input type="text" v-model="email" placeholder="Email"></v-input>
    <br>
    <v-input type="password" v-model="password" placeholder="Password"></v-input>
    <br>
    <v-btn color="success" @click="login">Login</v-btn>-->
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "login",
  data() {
    return {
      email: "",
      password: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+/.test(v) || "E-mail must be valid"
      ],
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      password: "Password",
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        emailMatch: () => "The email and password you entered don't match"
      }
    };
  },
  methods: {
    login: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          // eslint-disable-next-line
          loginPacket => {
            // here we commit the uid to our store...
            this.$store.commit('setUser', loginPacket.user.uid);
            // and get user details from firebase to move to the store as well.
            firebase.firestore()
              .collection('userDetails')
              .doc(loginPacket.user.uid)
              .get()
              .then(userDetails => {
                this.$store.commit('setUserInformation', userDetails.data());
              })
              .catch(err => console.log({err}));

            this.$router.replace("home");
          },
          err => {
            alert("Oops. " + err.message);
          }
        );
    }
  }
};
</script>

<style scoped>
/* "scoped" attribute limit the CSS to this component only */
.login {
  margin-top: 40px;
}
input {
  margin: 10px 0;
  width: 20%;
  padding: 15px;
}
button {
  margin-top: 20px;
  width: 10%;
  cursor: pointer;
}
p {
  margin-top: 40px;
  font-size: 13px;
}
p a {
  text-decoration: underline;
  cursor: pointer;
}
</style>