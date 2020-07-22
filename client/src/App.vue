<template>
  <v-app>
    <v-main>
      <v-row>
        <Notes />
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Notes from './components/Notes.vue'
export default Vue.extend({
  name: 'App',
  components: {
    Notes
  }
})
</script>
