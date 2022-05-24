<template>
  <div class="pa-4">
    <v-row class="mb-16">
      <v-col
        sm="6"
        xs="6"
        md="6"
        cols="12"
        lg="4"
        class="text-center text-lg-start text-md-start text-xl-start"
      >
      </v-col>
      <v-col sm="6" xs="6" md="6" cols="12" lg="4" class="text-start">
        <v-img
          :src="require('@/assets/images/logos/logo.svg')"
          alt="logo"
          max-width="250"
          max-height="60"
          class="mx-auto"
        ></v-img>
      </v-col>
      <v-col
        class="text-center text-lg-end text-md-end text-xl-end"
        sm="12"
        xs="12"
        md="6"
        cols="12"
        lg="4"
      >
      </v-col>
    </v-row>
    <v-row class="ma-2" align="center" justify="center">
      <v-col
        class="text-center text-lg-end text-md-end text-xl-end"
        sm="12"
        xs="12"
        md="6"
        cols="6"
        lg="2"
      >
        <v-avatar size="50">
          <v-img :src="require('@/assets/images/avatars/1.png')"></v-img>
        </v-avatar>
      </v-col>
      <v-col
        class="text-center text-lg-start text-md-start text-xl-start"
        sm="12"
        xs="12"
        md="6"
        cols="8"
        lg="8"
        align="center"
        justify="center"
      >
        <h1 class="text-h4 font-weight-black text-capitalize black--text">
          {{ blog.title }}
          <h5 class="caption ml-2">{{ formattedTime(blog.createdTime) }}</h5>
        </h1>
      </v-col>
      <v-col
        class="text-center text-lg-center text-md-center text-xl-center"
        sm="12"
        xs="12"
        md="6"
        cols="6"
        lg="2"
      >
        <span class="body-1 mt-3 font-weight-bold">
          {{ blog.peopleCounter + " Views" }}
        </span>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col class="text-start" sm="12" xs="12" md="8" cols="8" lg="8">
        <v-container class="mt-10">
          <h3 class="text-h5" v-html="blog.body"></h3>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import db from "@/services/FirebaseService";
import firebase from "firebase/compat";
import { formatTimeAgo, formatTimeTaken } from "@/helpers/dateConverter";

import NoResult from "@/components/my-blogs/NoResult";
import AppBarUserMenu from "@/layouts/components/AppBarUserMenu.vue";
export default {
  components: { NoResult, AppBarUserMenu },

  data: () => ({
    blog: null,
    blogId: null,
  }),

  mounted() {
    this.blogId = this.$route.params.id.trim();

    this.user = this.$store.getters.user;

    // this.loadBlogs();

    var query = db.collection("Blogs").doc(this.blogId);

    query
      .get()
      .then((doc) => {
        if (doc.exists) {
          this.blog = doc.data();
          var updateQuery = db.collection("Blogs").doc(this.blogId);

          updateQuery.update({
            peopleCounter: firebase.firestore.FieldValue.increment(1),
          });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });

    //increment peopleCounter in firestore
  },

  methods: {
    formattedTime(time) {
      return formatTimeAgo(time);
    },
    formattedTime1(difference) {
      return formatTimeTaken(difference);
    },
    routeToHighlightedWords() {
      this.$router.push({
        name: "highlightedWords",
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@/plugins/vuetify/default-preset/preset/misc.scss";
@import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap");
.v-expansion-panel::before {
  box-shadow: none !important;
}
.v-slider__track-container {
  height: 2px !important;
}
.v-slider__track {
  border-radius: 100px !important;
}

.popup-tag {
  position: fixed;
  display: none;
  background-color: #08a88a;
  color: #eeeeee;
  border-radius: 10px;

  padding: 5px;
  font-size: 20px;
  cursor: pointer;
  -webkit-filter: drop-shadow(0 1px 10px rgba(113, 158, 206, 0.8));
}

.div-textarea1 {
  min-height: 200px;
}
[contenteditable][placeholder]:empty:before {
  content: attr(placeholder);
  position: fixed;
  color: gray;
  background-color: transparent;
}
</style>
