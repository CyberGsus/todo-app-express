<template>
  <v-container>
    <v-alert
      prominent
      text
      border="right"
      :color="color"
      mode="out-in"
      transition="slide-y-transition"
      v-model="active"
    >
      <div v-html="text"></div>
    </v-alert>
  </v-container>
</template>

<script>
import betterMessage from '../helpers/betterMessages'
export default {
  name: 'Alert',
  data: () => ({
    active: false,
    mode: 0,
    text: '',
  }),
  props: {
    content: String,
  },
  computed: {
    color() {
      return ['green', 'orange lighten-1', 'red lighten-1'][this.mode]
    },
    textColor() {
      return this.mode > 0 ? 'white--text' : 'black--text'
    },
  },
  methods: {
    activate(mode = 0, text = 'Alerted!') {
      this.mode = mode >= 0 && mode < 3 ? mode : 0
      this.text = betterMessage(text)
      this.active = true
      const i = setInterval(
        function () {
          clearInterval(i)
          this.active = false
        }.bind(this),
        1500
      )
    },

  },

}
</script>
