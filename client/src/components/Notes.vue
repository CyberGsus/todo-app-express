<template>
  <v-row justify="center">
    <NoteItem v-for="note in notes" :key="note._id" :note="note" @save-note="submitNote(note)" @delete-note="deleteNote(note)" /> 
  </v-row>
</template>


<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import NoteItem from './NoteItem.vue'
// import _ from 'lodash'

const API_URI = 'http://localhost:8081/api/v1'

const config = {
  callAPI: false
}

const sleepAsync = (millis = 1000) =>
  new Promise(resolve => setTimeout(resolve, millis))

const groupBy = (arr, r = 1) => {
  const newarr = []
  if (r == 0) return []
  for (let i = 0; i < arr.length; i += r) {
    newarr.push(arr.slice(i, i + r))
  }
  return newarr
}

export default Vue.extend({
  name: 'Notes',
  components: {
    NoteItem
  },
  data: () => ({
    notes: config.callAPI
      ? []
      : [
          {
            title: 'Call Mom',
            description: `She must be very worried. I'd better call her`,
            color: '#000000',
            done: false
          },
          {
            title: 'Hello World',
            description: 'I am a teapot!',
            done: true,
            color: '#cccccc'
          }
        ],
    noteBeingEdited: {
      title: '',
      description: '',
      done: false,
      color: 'white'
    },
    noteIndex: null,
    formDialog: false,
    colorPickerOn: false,
    updatingData: false
  }),
  async mounted() {
    this.getNotes()
  },
  methods: {
    async getNotes() {
      if (config.callAPI) {
        const resp = await axios.get(`${API_URI}/notes`)
        this.notes = resp.data
      } else {
        await sleepAsync(250)
      }
    },
    async submitNote() {
      if (config.callAPI) {
        try {
          await axios.put(`${API_URI}/notes/`, this.noteBeingEdited)
          console.log('Note submitted!')
        } catch (err) {
          console.error(err)
        }
      } else {
        this.notes[this.noteIndex] = Object.assign(
          this.notes[this.noteIndex],
          this.noteBeingEdited
        )
        await sleepAsync(150)
      }
    },
    async deleteNote(note) {
      if (config.callAPI) {
        try {
          await axios({
            method: 'delete',
            url: `${API_URI}/notes/${note._id}`
          })
        } catch (err) {
          console.error(err)
        }
      } else {
        await sleepAsync(150)
      }
    },

    isColorDark(color) {
      const rgb = groupBy([...color.slice(1)], 2)
        .map(a => a.join(''))
        .map(s => parseInt(s, 16))
        .map(i => i / 255.0)

      const lightness = [Math.max, Math.min]
        .map(f => f.apply(null, rgb))
        .reduce((a, b) => (a + b) / 2, 0)

      return lightness >= 0.5
    }
  }
})
</script>
