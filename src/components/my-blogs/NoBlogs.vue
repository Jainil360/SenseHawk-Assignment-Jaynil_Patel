<template>
  <v-row align="center" justify="center">
    <v-col cols="12" align="center" justify="center">
      <div id="misc" class="">
        <div class="page-title text-center">
          <div class="misc-character d-flex justify-center mt-n10">
            <v-img
              :src="require('@/assets/images/logos/empty.gif')"
              max-width="200"
            ></v-img>
          </div>

          <!-- <v-icon size="100"> mdi-relation-zero-or-one-to-one-or-many </v-icon> -->

          <h2
            class="text-2xl mt-n15 font-weight-semibold text--primary d-flex align-center justify-center"
          >
            <span class="me-2">There are no Blogs.</span>
          </h2>
          <p class="text-sm">Let's write your first blog with SenseHawk</p>

          <!-- <div class="misc-character d-flex justify-center mt-n1">
              <v-img max-width="500" src="@/assets/images/3d/oops.png"></v-img>
            </div> -->
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {};
</script>

<style></style>
