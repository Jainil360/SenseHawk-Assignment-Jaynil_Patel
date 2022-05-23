<template>
  <div class="pa-4">
    <v-row align="center">
      <v-col
        sm="6"
        xs="6"
        md="6"
        cols="12"
        lg="6"
        class="text-center text-lg-start text-md-start text-xl-start"
      >
        <!-- <h3>{{ user.data.name }}</h3> -->
        <!-- <span class="text-lg-h5 text-xl-h5 text-h6 text-sm-h6">
          <v-icon color="success">mdi-file-tree</v-icon>
          <span class="font-weight-bold">My Space</span>
        </span>1 -->
        <v-img
          :src="require('@/assets/images/logos/logo.svg')"
          alt="logo"
          max-width="200"
          max-height="60"
        ></v-img>
      </v-col>

      <v-col
        class="text-center text-lg-end text-md-end text-xl-end"
        sm="6"
        xs="6"
        md="6"
        cols="12"
        lg="6"
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
                    <v-textarea
                      outlined
                      class="neu-card-in pt-5 pl-5 pr-5"
                      v-model="editedItem.body"
                      v-html="editedItem.body"
                      name="input-7-4"
                      label="Blog Body"
                    >
                    </v-textarea>
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
        <app-bar-user-menu :userName="user.data.email"></app-bar-user-menu>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title
              >Are you sure you want to delete
              <b class="primary--text ml-1 mr-1"> {{ editedItem.shortCutKey }} </b>
              shortcut?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="success" @click="closeDelete">No</v-btn>

              <v-btn color="error" @click="deleteBlogsFirebase">Yes</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row align="center" justify="center" v-if="BlogsList.length != 0">
      <v-col cols="8">
        <v-timeline dense>
          <div v-for="item in BlogsList" :key="item" class="">
            <v-timeline-item large class="mb-7">
              <template v-slot:icon>
                <v-avatar color="accent" class="neu-card-out">
                  <v-icon color="success">mdi-post</v-icon>
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
    BlogTypeList: ["Tech", "Travel", "Lifestyle"],
    fromList: [],
    toList: [],
    allUsers: [],
    someUsers: [],
    user: null,
    ApiLoader: false,
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
                Authorization:
                  "Bearer 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",
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
    updateProgress(item) {
      if (item.progress == 100) {
        db.collection("Blogs").doc(item.id).update({
          status: "Completed",
          progress: item.progress,
        });
      } else {
        db.collection("Blogs").doc(item.id).update({
          progress: item.progress,
          status: "Pending",
        });
      }
    },
    changeStatus(item) {
      if (item.progress == 100) {
        alert("Progress is 100%");
        db.collection("Blogs").doc(item.id).update({
          status: "Completed",
        });
      } else {
        db.collection("Blogs")
          .doc(item.id)
          .update({
            status: item.status == "Pending" ? "In Progress" : "Pending",
          });
      }
    },

    loadBlogs() {
      this.BlogsList = [];
      var query = db.collection("Blogs");
      // query = query.where("uid", "==", this.user.data.uid);
      // query = query.where("shortCutType", "==", "customShortcut");
      query
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            var obj = Object.assign(doc.data(), { id: doc.id });
            this.BlogsList.push(obj);
          });
          console.log("Document fetched successfully!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    },
    getUserDetails(obj) {
      var workingString = [];
      console.log(obj);
      obj.to.forEach((item) => {
        console.log("item", item);
        console.log("working", obj["timeStats_" + `${item}`].working);
        if (obj["timeStats_" + `${item}`].working) {
          this.allUsers.forEach((user) => {
            console.log("user", user.uid);
            if (item == user.uid) {
              workingString.push(user.name);
            }
          });
        }
      });
      return workingString;
    },

    getByUserImages(byList) {
      console.log(byList);
      var images = [];
      byList.forEach((item) => {
        this.allUsers.forEach((user) => {
          if (item == user.uid) {
            images.push(user.profilePic);
          }
        });
      });
      return images;
    },
    getToUserImages(byList) {
      console.log(byList);
      var images = [];
      byList.forEach((item) => {
        this.allUsers.forEach((user) => {
          if (item == user.uid) {
            images.push(user.profilePic);
          }
        });
      });
      return images;
    },

    loadAllUsers() {
      this.allUsers = [];
      var query = db.collection("users-tch");

      query
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.allUsers.push(doc.data());
            if (doc.data().uid != this.user.data.uid) {
              this.someUsers.push(doc.data());

              // var obj = Object.assign(doc.data(), { id: doc.id });
            } else if (doc.data().uid == this.user.data.uid) {
              this.fromList.push(doc.data().uid);
            }
            // this.allUsers.push(doc.data());
          });
          console.log("Document fetched successfully!");
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
</style>
