<template>
  <v-col cols="6" sm="12" md="6" lg="3" class="ma-3">
    <!-- Note card -->
    <v-card min-width="400px" max-width="600px" :color="cardColor">
      <v-card @click.native="cardClick" elevation="4">
        <v-card-title class="headline mb-1 pl-5" :style="cardTitleStyle">
          <v-row>
            <v-col cols="8" v-html="betterText(noteCopy.title)">
              {{ betterText(noteCopy.title) }}
            </v-col>
            <v-col cols="1" offset="2">
              <v-icon v-if="noteCopy.done" :color="checkMarkColor"
                >mdi-check-bold</v-icon
              >
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
      <v-row class="px-3">
        <v-card-text :style="{ color: buttonColor }">
          <v-col cols="10" v-html="betterText(noteCopy.description)">
          </v-col>
        </v-card-text>
      </v-row>
      <v-card-actions v-if="editable">
        <v-btn
          text
          bottom
          left
          :color="buttonColor"
          @click="$emit('note:edit', noteCopy)"
          >Edit
        </v-btn>
        <v-spacer />
        <v-btn
          text
          icon
          bottom
          right
          :color="buttonColor"
          @click="$emit('note:delete', noteCopy)"
          ><v-icon>mdi-delete</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
    <!-- Note card END -->
  </v-col>
</template>

<script>
import convert from 'color-convert'
import betterMessage from '../helpers/betterMessages'
import hljs from 'highlight.js'
export default {
  name: 'NoteItem',
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    note: {
      title: {
        type: String,
        required: true,
        validator: function (value) {
          return value.trim().length > 0
        },
      },
      description: {
        type: String,
        default: 'No description provided',
      },
      done: {
        type: Boolean,
        default: false,
      },
      color: {
        type: String,
        default: '#ff0000',
        validator: function (value) {
          return /^#(?:[0-9a-f]{3}){1,2}$/i.test(value)
        },
      },
    },
  },
  created() {
    this.noteCopy = Object.assign({}, this.note)
  },
  updated() {
    this.$el.querySelectorAll('pre code').forEach(hljs.highlightBlock)
  },
  data: () => ({
    noteCopy: {},
  }),
  watch: {
    note(val) {
      this.noteCopy = Object.assign({}, val)
    },
  },
  computed: {
    checkMarkColor() {
      //  NOTE: `this.note.color` is undefined when added to the list. why?
      let [h, s, l] = convert.hex.hsl(this.noteCopy.color || '#ff0000')
      l = (l < 50) * 100
      const hex = '#' + convert.hsl.hex(h, s, l)
      return hex
    },
    cardTitleStyle() {
      return {
        //  NOTE: `this.note.color` is undefined when added to the list. why?
        'background-color': this.noteCopy.color || '#ff0000',
        color:
          convert.hex.hsl(this.noteCopy.color || '#ff0000')[2] >= 50
            ? 'black'
            : 'white',
      }
    },
    cardColor() {
      //  NOTE: `this.note.color` is undefined when added to the list. why?
      let [h, s, l] = convert.hex.hsl(this.noteCopy.color || '#ff0000')
      l -= l > 75 ? l * 0.25 : l * -0.45
      s *= 0.95
      return '#' + convert.hsl.hex(h, s, l)
    },
    buttonColor() {
      return convert.hex.hsl(this.cardColor)[2] < 50 ? 'white' : 'black'
    },
  },
  methods: {
    isLightColor(color) {
      return convert.hex.hsl(color)[2] > 50
    },
    cardClick() {
      if (this.editable) {
        this.noteCopy.done = !this.noteCopy.done
        this.$emit('note:update:silent', {
          current: Object.assign({}, this.note),
          edit: this.noteCopy,
        })
      }
    },
    betterText(t) {
      return betterMessage(t, true)
    },
  },
}
</script>


<style lang="scss" scoped>
pre, code {
  color: none;
  background-color: none;
}
</style>
