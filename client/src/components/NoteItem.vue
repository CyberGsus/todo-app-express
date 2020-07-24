<template>
  <v-col cols="6">
    <!-- Note card -->
    <v-card
      min-width="400px"
      max-width="600px"
      :dark="isLightColor(note.color)"
    >
      <v-container>
        <v-card-title class="headline mb-1">
          {{ note.title }}
          <v-spacer />
          <v-icon v-if="note.done" color="green">mdi-check-bold</v-icon>
        </v-card-title>
      </v-container>
      <v-divider />
      <v-row class="px-3">
        <v-card-text>
          <v-col cols="11">
            <p>{{ note.description }}</p>
          </v-col>
        </v-card-text>
      </v-row>
      <v-card-actions>
        <v-btn text :color="note.color" @click="$emit('note:edit', note)"
          >Edit note
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- Note card END -->
  </v-col>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'NoteItem',
  props: {
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
        validator: function (value) {
          return /^#(?:[0-9a-f]{3}){1,2}$/i.test(value)
        },
      },
    },
  },
  data: () => ({
    formDialog: false,
    noteEdited: {
      title: '',
      description: '',
      done: false,
      color: '#000',
    },
  }),
  methods: {
    groupBy(arr, r = 2) {
      const newarr = []
      if (r === 0) return []
      for (let i = 0; i < arr.length; i += r) {
        newarr.push(arr.slice(i, i + r))
      }
      return newarr
    },
    getLightness(color) {
      let colorVal = color.slice(1)
      if (colorVal.length == 3) {
        colorVal = [...colorVal].map((i) => i.repeat(2))
      } else {
        colorVal = this.groupBy([...colorVal], 2).map((a) => a.join(''))
      }
      return (
        colorVal
          .map((s) => parseInt(s, 16) / 255) // parse hex to number and get them into 0-1 range
          .map((_, __, arr) => arr.slice()) // generate copies of the array
          .slice(0, 2) // select only 2
          // Convert into min and max of the array
          .map((arr, i) => Math[['max', 'min'][i % 2]].apply(null, arr))
          // median
          .reduce((a, b, i) => (a + b) / (i + 1), 0)
      )
    },
    isLightColor(color) {
      return this.getLightness(color) > 0.5
    },
    deleteNote() {
      console.log('Delete note', this.note)
      console.log('Maybe a confirmation dialog???')
    },
    saveNote() {
      console.log('Saving note', this.note)
      // emit an event to save the note
    },
  },
})
</script>
