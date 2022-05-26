<template>
  <div class="pa-4">
    <v-row>
      <v-col
        sm="6"
        xs="6"
        md="6"
        cols="12"
        lg="4"
        class="text-center text-lg-start text-md-start text-xl-start"
      >
      </v-col>
      <v-col
        sm="6"
        xs="6"
        md="6"
        cols="12"
        lg="4"
        class="text-center text-lg-center text-md-center text-xl-center"
      >
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

    <v-row v-if="BlogsList.length != 0">
      <!-- side filter navigation bar -->
      <v-col
        class="text-start text-lg-start text-md-start text-xl-start"
        sm="12"
        xs="12"
        md="6"
        cols="12"
        lg="3"
      >
        <v-card-title>
          <v-text-field
            v-model="searchWords"
            label="Search Highlighted Words"
            hide-details
            outlined
            clearable
            class="neu-card-in-default"
          ></v-text-field>
          <button class="neu-card-out pa-2 ml-3" v-on:click="filterBySearchWords">
            <v-icon color="success">mdi-magnify</v-icon>
          </button>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(item, index) in BlogsListHighlightedWords" :key="index">
              <v-list-item-content>
                <v-list-item-title>
                  <v-chip
                    v-on:click="filterBlogList(item)"
                    :color="item.active ? 'success' : ''"
                  >
                    {{ item.word }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-col>
      <!-- end of side filter navigation bar -->
      <v-divider vertical></v-divider>

      <v-col cols="8" v-if="filterResult.length > 0">
        <v-timeline dense>
          <div v-for="item in filterResult" :key="item" class="">
            <v-timeline-item large class="mb-7">
              <template v-slot:icon>
                <v-avatar
                  color="accent"
                  class="neu-card-out"
                  v-on:click="openBlog(item.id)"
                >
                  <v-icon color="success">mdi-book-open-blank-variant</v-icon>
                </v-avatar>
              </template>

              <div class="neu-card-out-default" v-on:click="openBlog(item.id)">
                <v-row align="center">
                  <v-col cols="12">
                    <v-card-title class="font-weight-medium primary--text mb-n5 mt-n5">
                      {{ item.title }}
                    </v-card-title>
                  </v-col>
                </v-row>

                <v-card-subtitle class="mb-n1" v-html="item.body"> </v-card-subtitle>
                <v-card-text>
                  <v-row align="center">
                    <v-col align="start" cols="6" lg="6" xl="12" md="6" sm="12">
                      <span class="body-1 mt-3 font-weight-bold">
                        {{ item.peopleCounter + " Views" }}
                      </span>
                    </v-col>

                    <v-col cols="6" lg="6" xl="12" md="6" sm="12" align="end">
                      <v-icon small>mdi-clock-outline</v-icon>
                      <span class="caption ml-2">{{
                        formattedTime(item.createdTime)
                      }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
              </div>
            </v-timeline-item>
          </div>
        </v-timeline>
      </v-col>
      <NoResult v-else />
    </v-row>
  </div>
</template>

<script>
import db from "@/services/FirebaseService";
import { formatTimeAgo, formatTimeTaken } from "@/helpers/dateConverter";

import NoResult from "@/components/my-blogs/NoResult";
import AppBarUserMenu from "@/layouts/components/AppBarUserMenu.vue";
export default {
  components: { NoResult, AppBarUserMenu },

  data: () => ({
    BlogsList: [],
    filterResult: [],
    selectedIds: [],
    BlogsListHighlightedWords: [],
    dialog: false,
    searchWords: "",

    dialogDelete: false,
    show: false,

    editedIndex: -1,
    editedItem: {
      title: "",
      body: "",
    },
    defaultItem: {
      title: "",
      body: "",
    },
    BlogTypeList: ["Tech", "Travel", "Lifestyle"],
    fromList: [],
    toList: [],
    allUsers: [],
    someUsers: [],
    user: null,
    ApiLoader: false,
    selection: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Blog" : "Edit Blog";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.user = this.$store.getters.user;

    // this.loadBlogs();

    var query = db.collection("Blogs");

    query.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          this.BlogsList.push({
            id: change.doc.id,
            ...change.doc.data(),
          });
        }
        if (change.type === "modified") {
          let changedDoc = {
            id: change.doc.id,
            ...change.doc.data(),
          };

          this.BlogsList.find((doc) => {
            if (doc.id === change.doc.id) {
              doc.title = changedDoc.title;
              doc.body = changedDoc.body;

              doc.peopleCounter = changedDoc.peopleCounter;

              doc.to.forEach((user) => {
                doc["timeStats_" + user] = changedDoc["timeStats_" + user];
              });
            }
          });
        }
        if (change.type === "removed") {
          this.BlogsList = this.BlogsList.filter((doc) => {
            return doc.id !== change.doc.id;
          });
        }
        this.getHighlightedWords(this.BlogsList);
      });
    });
  },

  methods: {
    // Filtering the blog list based on the highlighted words.
    filterBySearchWords() {
      this.BlogsListHighlightedWords.forEach((item) => {
        if (
          item.word.toString().trim().toLowerCase() ==
          this.searchWords.toString().trim().toLowerCase()
        ) {
          this.filterBlogList(item);
        }
      });
    },
    // Filtering the blog list based on the highlighted words.
    filterBlogList(item) {
      this.filterResult = [];

      this.BlogsListHighlightedWords.forEach((hitem) => {
        if (hitem.word == item.word) {
          if (!item.active) {
            if (this.selectedIds.indexOf(item) == -1) {
              this.selectedIds.push(item);
            }
            hitem.active = true;

            this.BlogsList.forEach((item) => {
              this.selectedIds.forEach((id) => {
                if (item.id == id.id) {
                  if (this.filterResult.indexOf(item) == -1) {
                    this.filterResult.push(item);
                  }
                }
              });
            });
          } else {
            this.selectedIds.splice(this.selectedIds.indexOf(item), 1);
            hitem.active = false;
            this.BlogsList.forEach((item) => {
              this.selectedIds.forEach((id) => {
                if (item.id == id.id) {
                  if (this.filterResult.indexOf(item) == -1) {
                    this.filterResult.push(item);
                  }
                }
              });
            });
          }
        }
      });
    },

    // Getting all the words which are wrapped in mark tag and remove mark tags and remove if it is empty.
    getHighlightedWords(blogList) {
      this.BlogsListHighlightedWords = [];
      blogList.map((item) => {
        //get words which are wrapped in mark tag and remove mark tags and remove if it is empty
        let words = item.body.match(/<mark>(.*?)<\/mark>/g);
        if (words) {
          words = words.map((word) => {
            return word.replace(/<mark>|<\/mark>/g, "");
          });
          words = words.filter((word) => {
            return word !== "";
          });
        }
        if (words) {
          words.forEach((word) => {
            console.log(word);
            if (this.BlogsListHighlightedWords.indexOf(word) === -1) {
              this.BlogsListHighlightedWords.push({
                word: word,
                id: item.id,
                active: false,
              });
            }
          });
        }
      });
    },

    formattedTime(time) {
      return formatTimeAgo(time);
    },
    formattedTime1(difference) {
      return formatTimeTaken(difference);
    },

    openBlog(id) {
      let routeData = this.$router.resolve({ name: "blog", params: { id: id } });
      window.open(routeData.href, "_blank");
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
