<template>
  <v-container v-if="alerts.length > 0">
    <v-alert
      v-for="alert in alerts"
      prominent
      text
      :key="alert.id"
      border="right"
      :color="alert.color"
      mode="out-in"
      transition="slide-y-transition"
      v-model="alert.active"
    >
      <div v-html="alert.text"></div>
    </v-alert>
  </v-container>
</template>

<script>
  import betterMessage from '../helpers/betterMessages'
  import { nanoid } from 'nanoid'
  export default {
    name: 'Alert',
    data: () => ({
      alerts: []
    }),
    props: {
      content: String
    },
    computed: {
      textColor() {
        return this.mode > 0 ? 'white--text' : 'black--text'
      }
    },
    created() {},
    methods: {
      requestActivate(mode = 0, text = 'Alerted!') {
        this.queue.push({ mode, text })
      },
      activate(mode = 0, text = 'Alerted!') {
        this.mode = mode >= 0 && mode < 3 ? mode : 0
        this.text = betterMessage(text)
        const alert = {
          mode,
          text: betterMessage(text),
          active: true,
          color: ['green', 'orange lighten-1', 'red lighten-1'][mode],
          textColor: mode > 0 ? 'white--text' : 'black--text',
          id: nanoid(4)
        }
        this.alerts.push(alert)
        const i = setInterval(
          function () {
            clearInterval(i)
            this.active = false
          }.bind(alert),
          2000
        )

        const j = setInterval(
          function () {
            clearInterval(j)
            this.alerts = this.alerts.filter(a => a.id !== alert.id)
          }.bind(this),
          2200
        )
      }
    }
  }
</script>
