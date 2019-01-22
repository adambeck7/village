<template>
  <div class="hello">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar card color="#368cbf " dark>
            <v-icon>arrow_back</v-icon>
            <v-toolbar-title>Compose</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon>send</v-icon>
          </v-toolbar>
          <v-form class="compose-test">
            <v-autocomplete
              class="compose-test2"
              v-model="selected"
              :items="['Adam Ahern', 'Adam Beck', 'Jack Ryan']"
              chips
              label="To"
              full-width
              hide-details
              hide-no-data
              hide-selected
              multiple
              single-line
            ></v-autocomplete>
            <v-divider></v-divider>
            <!-- <v-text-field label="Subject" value single-line full-width hide-details></v-text-field> -->
            <!-- <v-divider></v-divider> -->
            <v-textarea
              v-model="body"
              label="Message"
              counter
              maxlength="120"
              full-width
              single-line
            ></v-textarea>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "Compose",
  props: {
    msg: String
  },
  data() {
    return {
      selected: [],
      items: ["Adam Ahern", "Adam Beck", "Jack Ryan"],
      body: ""
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.compose-input {
  -webkit-box-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.compose-test2
  > .v-input__control
  > .v-input__slot
  > .v-menu
  > .v-menu__content {
  top: 3em !important;
  left: 0em !important;
}
</style> 
 
 