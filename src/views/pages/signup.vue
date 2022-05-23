<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <div class="auth-card neu-card-out">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <v-img
            :src="require('@/assets/images/logos/logo.svg')"
            max-width="350"
            max-height="100"
            alt="logo"
          ></v-img>
        </v-card-title>

        <!-- title -->
        <v-card-text class="text-center">
          <p class="text-2xl font-weight-semibold text--primary mb-2" v-if="step == 1">
            Adventure starts here 🚀
          </p>
          <p class="text-2xl font-weight-semibold text--primary" v-else>
            Almost there, {{ name }} 🎉
          </p>
        </v-card-text>

        <!-- login form -->
        <v-card-text>
          <v-form>
            <span v-if="step == 1">
              <v-row align="center">
                <v-col justify="center" align="center" cols="4">
                  <!-- upload images -->

                  <input
                    ref="file"
                    type="file"
                    @change="uploadImage"
                    style="display: none"
                  />

                  <v-avatar size="100">
                    <v-img
                      @click="$refs.file.click()"
                      :src="
                        image == '' ? require('@/assets/images/avatars/6.png') : image
                      "
                      alt="logo"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col justify="center" align="center">
                  <v-text-field
                    v-model="name"
                    outlined
                    label="Full Name"
                    required
                    placeholder="E.g. Jaynil Patel"
                    hide-details
                    class="mb-5 neu-card-in-default pa-2"
                  ></v-text-field>
                </v-col>
              </v-row>
            </span>
            <span v-else>
              <v-text-field
                v-model="email"
                type="email"
                outlined
                label="Email"
                placeholder="E.g. john@example.com"
                hide-details
                class="mb-5 neu-card-in-default pa-2"
              ></v-text-field>
              <v-text-field
                v-model="password"
                outlined
                :type="isPasswordVisible ? 'text' : 'password'"
                label="Password"
                placeholder="············"
                :append-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye-outline'"
                hide-details
                @click:append="isPasswordVisible = !isPasswordVisible"
                class="mb-5 neu-card-in-default pa-2"
              ></v-text-field>
            </span>
            <!-- <v-checkbox hide-details class="mt-1 text-center">
              <template #label>
                <div class="d-flex align-center flex-wrap text-center justify-center">
                  <span>I agree to</span
                  ><a href="javascript:void(0)">privacy policy &amp; terms</a>
                </div>
              </template>
            </v-checkbox> -->
            <v-btn
              v-if="step == 1"
              block
              color="success accent--text"
              style="border-radius: 10px"
              class="mt-8 pa-6"
              :disabled="name == ''"
              :loading="uploadingFlag ? true : false"
              @click="
                image == '' ? showError('Upload ProfilePic to continue.') : (step = 2)
              "
            >
              Next
              <v-icon> mdi-chevron-right </v-icon>
            </v-btn>
            <v-row>
              <v-col>
                <v-btn
                  v-if="step == 2"
                  block
                  color="primary accent--text"
                  style="border-radius: 10px"
                  class="mt-8 pa-6"
                  @click="step = 1"
                >
                  <v-icon> mdi-chevron-left </v-icon>

                  Back
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  v-if="step == 2"
                  block
                  color="success accent--text"
                  style="border-radius: 10px"
                  class="mt-8 pa-6"
                  v-on:click="signUp"
                  :disabled="
                    name == '' ||
                    image == '' ||
                    org == '' ||
                    email == '' ||
                    password == ''
                  "
                >
                  Signup
                  <v-icon> mdi-chevron-right </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <!-- create new account  -->
        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2"> Already have an account? </span>
          <router-link :to="{ name: 'login' }"> Sign in instead </router-link>
        </v-card-text>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline

import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";

export default {
  data() {
    return {
      isPasswordVisible: false,
      name: "",
      image: "",
      imageURL: "",
      uploadingFlag: false,
      orgList: ["Technicolor - Chennai"],
      email: "",
      password: "",
      step: 1,
      loading: false,
      socialLink: [
        {
          icon: "mdi-google",
          color: "#db4437",
          colorInDark: "#db4437",
        },
      ],
    };
  },
  methods: {
    showError(message) {
      this.$swal
        .fire({
          icon: "warning",
          title: message,
          timer: 2500,
          confirmButtonText: "Upload ProfilePic",

          confirmButtonColor: "#08a88a",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$refs.file.click();
          }
        });
    },
    uploadImage(e) {
      this.uploadingFlag = true;
      const image = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.image = e.target.result;
        this.onUpload(image);
      };
    },
    onUpload(image) {
      const file = image;
      const storageRef = firebase.storage().ref();
      const imageName = Date.now() + "-" + file.name;
      const imageRef = storageRef.child(imageName);
      imageRef.put(file).then((snapshot) => {
        imageRef.getDownloadURL().then((url) => {
          this.imageURL = url;
          console.log(this.imageURL);
          this.uploadingFlag = false;
        });
      });
      // firebase.storage
      //   .ref("images/" + file.name)
      //   .put(file)
      //   .then((response) => {
      //     alert("Uploaded Successfully");
      //     response.ref
      //       .getDownloadURL()
      //       .then((downloadURL) => {
      //         alert("File uploaded successfully");

      //         // firebase
      //         //   .database()
      //         //   .ref(YOUR_DATABASE)
      //         //   .child(THE_USER_ID)
      //         //   .update({ imageUrl: downloadURL });
      //       })
      //       .catch((err) => console.log(err));
      //   });
    },
    signUp() {
      var userTemp = {};
      this.loading = true;

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          console.log(data.user, this.name);
          userTemp.uid = data.user.uid;
          userTemp.name = this.name;
          userTemp.image = this.imageURL;
          userTemp.org = this.org;
          userTemp.email = this.email;

          firebase
            .firestore()
            .collection("users-tch")
            .add({
              name: this.name,
              profilePic: this.imageURL,
              org: this.org,
              email: this.email,
              uid: data.user.uid,
            })

            .then(() => {
              // this.$store.commit('SET_USER', {
              //   displayName: this.name,
              //   email: this.email,
              // })
              console.log("User updated", data.user);
              this.$store.commit("SET_USER", userTemp);
              this.loading = false;

              this.$router.replace({ name: "my-threads" });
              this.$swal
                .fire({
                  icon: "success",
                  title: "Successfully Signed Up",
                  confirmButtonText: "Continue",

                  confirmButtonColor: "#08a88a",
                })
                .then(() => {
                  // this.$refs.file.click();
                  window.location.reload();
                });
              // window.location.reload();
              // this.$router.replace({ name: "my-threads" });
            });
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
};
</script>

<style lang="scss">
@import "~@/plugins/vuetify/default-preset/preset/pages/auth.scss";
</style>
