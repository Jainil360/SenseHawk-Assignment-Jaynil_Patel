<template>
  <v-app>
    <v-main>
      <div class="app-content-container boxed-container pa-3">
        <slot></slot>
      </div>
    </v-main>
    <v-footer app inset color="transparent" absolute height="56" class="px-0 text-center">
      <div class="boxed-container w-full">
        <div class="mx-6 d-flex justify-space-between">
          <span>
            &copy; 2022 | Developed with 🖤 by
            <a class="text-decoration-none" v-on:click="signOut()">
              Hecto Technologies India
            </a></span
          >
          <!-- <span class="d-sm-inline d-none">
            <a
              href="https://themeselection.com/products/category/download-free-admin-templates/"
              target="_blank"
              class="me-6 text--secondary text-decoration-none"
            >Freebies</a>
            <a
              href="https://themeselection.com/blog/"
              target="_blank"
              class="me-6 text--secondary text-decoration-none"
            >Blog</a>
            <a
              href="https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free/blob/main/LICENSE"
              target="_blank"
              class="text--secondary text-decoration-none"
            >MIT Licence</a>
          </span> -->
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import { ref } from "@vue/composition-api";
import { mdiMagnify, mdiBellOutline, mdiGithub } from "@mdi/js";
import AppBarUserMenu from "./components/AppBarUserMenu.vue";

export default {
  components: {
    AppBarUserMenu,
  },
  setup() {
    const isDrawerOpen = ref(null);

    return {
      isDrawerOpen,

      // Icons
      icons: {
        mdiMagnify,
        mdiBellOutline,
        mdiGithub,
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.v-app-bar ::v-deep {
  .v-toolbar__content {
    padding: 0;

    .app-bar-search {
      .v-input__slot {
        padding-left: 18px;
      }
    }
  }
}

.boxed-container {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}
</style>
