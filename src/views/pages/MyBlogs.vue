<template>
  <div class="pa-4">
    <v-row align="center" justify="center">
      <v-col
        sm="12"
        xs="12"
        md="12"
        cols="12"
        lg="4"
        class="text-center text-lg-start text-md-start text-xl-start"
      >
        <v-dialog v-model="dialog" overlay-opacity="0.8" max-width="80%">
          <template v-slot:activator="{ on, attrs }">
            <button class="neu-out-btn" v-bind="attrs" v-on="on">
              <v-icon color="accent" small>mdi-pencil</v-icon> New Blog
            </button>
          </template>
          <v-card>
            <v-card-title>
              <v-col>
                <span class="text-h5">{{ formTitle }}</span>
              </v-col>
              <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col sm="8" xs="6" md="8" cols="12" lg="8" xl="8">
                    <v-text-field
                      v-model="editedItem.title"
                      rounded
                      dense
                      outlined
                      class="neu-card-in pa-2"
                      hide-details
                      label="Blog Title"
                      style="height: 55px"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="4" xs="6" md="4" cols="12" lg="4" xl="4">
                    <button class="neu-card-out-default pa-4" v-on:click="writeBlog">
                      <v-progress-circular
                        v-if="ApiLoader"
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                      <span v-else>
                        <v-icon color="success" class="text-center"> mdi-auto-fix</v-icon>
                        <span class="subtitle text-lowercase ml-2"
                          >Generate Blog from Title using A.I
                        </span>
                      </span>
                    </button>
                  </v-col>
                </v-row>

                <v-row align="center" justify="center">
                  <v-col align="center">
                    <div
                      contenteditable
                      placeholder="Blog Content"
                      class="neu-card-in pt-5 pl-5 pr-5 text-left div-textarea1"
                      v-html="editedItem.body"
                      name="input-7-4"
                      label="Blog Body"
                      @focusout="updateBody"
                      id="div-textarea"
                      @mouseup="getSelectedText"
                    ></div>
                    <span class="popup-tag" v-on:click="highLightText()">
                      <v-icon color="accent" class="pa-1"> mdi-marker</v-icon>
                    </span>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-spacer></v-spacer>
                  <v-col
                    sm="12"
                    xs="12"
                    md="12"
                    cols="12"
                    lg="4"
                    xl="4"
                    class="text-center text-lg-end text-xl-end"
                  >
                    <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col
        sm="6"
        xs="6"
        md="6"
        cols="12"
        lg="4"
        justify="center"
        align="center"
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
        <button class="neu-card-out-default pa-3" @click="routeToHighlightedWords">
          <span class="subtitle text-lowercase ml-2">Highlighted Words</span>
        </button>
        <app-bar-user-menu
          :userName="user.data.displayName"
          :imgUrl="user.data.photoURL"
        ></app-bar-user-menu>
      </v-col>
    </v-row>

    <v-row align="center" justify="center" v-if="BlogsList.length != 0">
      <v-col cols="8">
        <v-timeline dense>
          <div v-for="item in BlogsList" :key="item" class="">
            <v-timeline-item large class="mb-7">
              <template v-slot:icon>
                <v-avatar
                  color="accent"
                  class="neu-card-out"
                  v-on:click="openBlog(item.id)"
                >
                  <v-icon color="success">mdi-eye</v-icon>
                </v-avatar>
              </template>

              <div class="neu-card-out-default">
                <v-row align="center">
                  <v-col cols="12" lg="6" xl="6" md="6" sm="6">
                    <v-card-title class="font-weight-medium primary--text mb-n5 mt-n5">
                      {{ item.title }}
                    </v-card-title>
                  </v-col>

                  <v-spacer></v-spacer>

                  <v-col cols="2" lg="1" xl="1" md="1" sm="1">
                    <v-menu bottom left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn dark icon v-bind="attrs" v-on="on">
                          <v-icon color="#757575">mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="editItem(item)">
                          <v-icon small left>mdi-pencil</v-icon>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="deleteItem(item)" class="error--text">
                          <v-icon small left color="error">mdi-delete</v-icon>

                          <v-list-item-title>Delete </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-card-subtitle class="mb-n1" v-html="item.body"> </v-card-subtitle>
                <v-card-text>
                  <v-row align="center">
                    <v-col align="start" cols="6" lg="6" xl="12" md="6" sm="12">
                      <span
                        v-if="item.peopleCounter == 0"
                        class="body-1 mt-3 font-weight-bold"
                      >
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
    </v-row>

    <NoBlogs v-else />
  </div>
</template>

<script>
import db from "@/services/FirebaseService";
import { formatTimeAgo, formatTimeTaken } from "@/helpers/dateConverter";
import axios from "axios";

import NoBlogs from "@/components/my-blogs/NoBlogs";
import AppBarUserMenu from "@/layouts/components/AppBarUserMenu.vue";
export default {
  components: { NoBlogs, AppBarUserMenu },

  data: () => ({
    BlogsList: [],
    dialog: false,

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
    query = query.where("createdBy", "==", this.user.data.uid);

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
      });
    });
    this.loadAllUsers();
  },

  methods: {
    // Highlighting the text in the textarea.
    highLightText() {
      var range = document.createRange();
      var sel = this.selection;
      //The word shouldn’t contain any characters other than alphanumeric [a-z][0-9][A-Z] to be highlighted allow spaces.
      var re = /[^a-zA-Z0-9\s]/g;
      // var re = /[^a-zA-Z0-9]/g;
      if (sel.toString().trim().match(re)) {
        this.$swal.fire({
          title: "Invalid Selection",
          text:
            "Highlighted text shouldn’t contain any characters other than alphanumeric [a-z][0-9][A-Z]",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }

      range.setStart(sel.anchorNode, sel.anchorOffset);
      range.setEnd(sel.focusNode, sel.focusOffset);

      if (range) range.surroundContents(document.createElement("mark"));
      this.editedItem.body = document.getElementById("div-textarea").innerHTML;

      $("span.popup-tag").css("display", "none");
      this.selection = null;
    },
    // Getting the selected text and displaying a popup tag.
    getSelectedText(e) {
      var sel;
      if (window.Selection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          if (sel.toString().length > 0) {
            this.selection = sel;
            sel = sel.toString().trim();

            $("span.popup-tag").css("display", "block");
            $("span.popup-tag").css("top", e.clientY);
            $("span.popup-tag").css("left", e.clientX);
          } else {
            $("span.popup-tag").css("display", "none");
          }
        }
      }
    },
    hideToolbar() {
      $("span.popup-tag").css("display", "none");
    },
    updateBody(e) {
      this.editedItem.body = e.target.innerHTML;
      // this.hideToolbar();
    },
    async writeBlog() {
      if (this.editedItem.title == "") {
        this.$swal.fire({
          title: "Oops...",
          text: "Title is required",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        this.ApiLoader = true;
        var prefix = "Write a creative blog for the following title:\n\nTitle:";
        var textTemp = prefix + '"' + this.editedItem.title + '\n"';
        await axios
          .post(
            "https://api.openai.com/v1/engines/text-davinci-002/completions",
            {
              prompt: textTemp,
              temperature: 0,
              max_tokens: 200,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0,
            },
            {
              headers: {
                Authorization: "Bearer " + your_app_secret_key,
              },
            }
          )
          .then((response) => {
            this.editedItem.body = response.data.choices[0].text.replace(/\s+/g, " ");
            this.ApiLoader = false;
          });
      }
    },
    saveBlogsFirebase(data) {
      data.createdBy = this.user.data.uid;

      data.createdTime = new Date().getTime();
      data.peopleCounter = 0;
      db.collection("Blogs")
        .add(data)
        .then(() => {
          console.log("Document successfully written!");
          this.$swal
            .fire({
              position: "top-end",
              icon: "success",
              title: "New Blog has been created",
              showConfirmButton: false,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
              toast: true,
              timer: 2500,
            })
            .then(() => {});
          // this.loadBlogs();
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },
    updateBlogsFirebase(data) {
      console.log(data);

      db.collection("Blogs")
        .doc(this.editedItem.id)
        .set(data)
        .then(() => {
          this.$swal
            .fire({
              position: "top-end",
              icon: "success",
              title: "Blog has been Updated",
              showConfirmButton: false,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
              toast: true,
              timer: 2500,
            })
            .then(() => {});
          // this.loadBlogs();
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },

    deleteBlogsFirebase() {
      db.collection("Blogs")
        .doc(this.editedItem.id)
        .delete()
        .then(() => {
          this.$swal
            .fire("Deleted!", "Your Blog has been deleted.", "success")
            .then((result) => {});
          this.loadBlogs();
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },

    editItem(item) {
      this.editedIndex = this.BlogsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.BlogsList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.deleteBlogsFirebase().then(() => {});
          }
        });
    },

    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    save() {
      if (this.editedIndex > -1) {
        //update here

        const { id, ...saveObj } = this.editedItem;
        // console.log(saveObj);
        this.updateBlogsFirebase(saveObj);
      } else {
        // alert("In save")
        // save here

        const { id, ...saveObj } = this.editedItem;
        this.saveBlogsFirebase(saveObj);
      }
      this.close();
    },

    formattedTime(time) {
      return formatTimeAgo(time);
    },
    formattedTime1(difference) {
      return formatTimeTaken(difference);
    },
    routeToHighlightedWords() {
      let routeData = this.$router.resolve({ name: "highlightedWords" });
      window.open(routeData.href, "_blank");
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
