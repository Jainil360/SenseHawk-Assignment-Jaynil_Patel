<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <div class="auth-card neu-card-out">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <v-img
            :src="require('@/assets/images/logos/logo.svg')"
            alt="logo"
            max-width="350"
            max-height="100"
          ></v-img>
        </v-card-title>

        <v-card-text>
          <v-form>
            <v-text-field
              v-model="email"
              outlined
              label="Email"
              hide-details
              placeholder="john@example.com"
              class="mb-5 neu-card-in-default pa-2"
            ></v-text-field>

            <v-text-field
              class="neu-card-in-default mb-5 mt-5 pa-2"
              v-model="password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Password"
              placeholder="············"
              :append-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              hide-details
              @click:append="isPasswordVisible = !isPasswordVisible"
            ></v-text-field>

            <div class="d-flex align-center justify-space-between flex-wrap">
              <v-checkbox label="Remember Me" hide-details class="me-3 mt-1">
              </v-checkbox>

              <a href="javascript:void(0)" class="mt-1"> Forgot Password? </a>
            </div>

            <v-btn
              block
              color="success accent--text"
              style="border-radius: 10px"
              class="mt-8 pa-6"
              v-on:click="login"
            >
              Login
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2"> New on our platform? </span>
          <router-link :to="{ name: 'signup' }"> Create an account </router-link>
        </v-card-text>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default {
  data() {
    return {
      isPasswordVisible: false,
      loading: false,
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      this.loading = true;

      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.loading = false;
          this.$router.replace("my-blogs");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style lang="scss">
@import "~@/plugins/vuetify/default-preset/preset/pages/auth.scss";
</style>
