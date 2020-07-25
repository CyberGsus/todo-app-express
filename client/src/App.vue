<template>
  <v-app>
    <v-main>
      <Alert :mode="alertMode" ref="alert" >
        {{ alertText }}
      </Alert>
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
    alertText: '',
    alertMode: 0
  }),
  methods: {
    showAlert({ mode, text }) {
      this.alertText = text.toString()
      this.$refs.alert.activate(['ok', 'alert', 'error'].indexOf(mode), text)
    }
  }
})
</script>
