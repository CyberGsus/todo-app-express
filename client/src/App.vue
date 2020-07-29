<template>
  <v-app>
    <v-main>
      <Alert ref="alert" />
      <Notes @alert:show="showAlert" />
    </v-main>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import Notes from './components/Notes.vue'
  import Alert from './components/Alert.vue'
  export default Vue.extend({
    name: 'App',
    components: {
      Notes,
      Alert
    },
    data: () => ({
    }),
    methods: {
      showAlert({ mode, text }) {
        text = text.toString()
        this.$refs.alert.activate(['ok', 'alert', 'error'].indexOf(mode), text)
      }
    }
  })
</script>
