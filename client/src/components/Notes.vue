<template>
  <v-row justify="center">
    <!-- edit note dialog -->
    <v-dialog v-model="formDialog" fullscreen>
      <v-card>
        <v-card-title class="heading mb-2 yellow lighten-2"
          >Edit note</v-card-title
        >
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Title"
                  required
                  v-model="noteEdited.title"
                  outlined
                />
                <v-textarea
                  clearable
                  v-model="noteEdited.description"
                  label="Description"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row justify="space-between">
              <v-col cols="9">
                <v-checkbox v-model="noteEdited.done" label="Done" />
              </v-col>
              <v-spacer />
              <v-col>
                <v-color-picker hide-inputs v-model="noteEdited.color" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn text @click="openConfirmationDialog" color="red lighten-2"
            >Delete note</v-btn
          >
          <v-spacer />
          <v-btn text @click="updateNote" color="green lighten-1"
            >Save note</v-btn
          >
          <v-btn text @click="closeDialog" color="blue lighten-1">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit note dialog END -->
    <!-- Confirmation dialog -->
    <v-dialog
      v-model="confirmationDialog"
      max-width="600px"
      @click:outside="closeConfirmationDialog(false)"
    >
      <v-card color="red" dark>
        <v-card-title class="heading mb-2">
          Delete note?
        </v-card-title>
        <v-card-text>
          <b>
            Are you sure you want to delete this note? this is unrecoverable!
          </b>
        </v-card-text>
        <v-divider />
        <v-card-actions class="red darken-2">
          <v-btn @click="closeConfirmationDialog(true)" text color="white"
            >Yes, I want to delete this note</v-btn
          >
          <v-spacer />
          <v-btn @click="closeConfirmationDialog(false)" text color="white"
            >No, let me decide again!</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation dialog END -->
    <NoteItem
      v-for="note in notes"
      :key="note._id"
      :note="note"
      @note:edit="editNote"
    />
  </v-row>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import NoteItem from './NoteItem.vue'

const API_URI = 'http://localhost:8081/api/v1'

const config = {
  callAPI: false,
}

const sleepAsync = (millis = 1000) =>
  new Promise((resolve) => setTimeout(resolve, millis))

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
    NoteItem,
  },
  data: () => ({
    notes: config.callAPI
      ? []
      : [
          {
            _id: 1, // will be the _id from mongodb
            title: 'Call Mom',
            description: `She must be very worried. I'd better call her`,
            color: '#000000',
            done: false,
          },
          {
            _id: 2,
            title: 'Hello World',
            description: 'I am a teapot!',
            done: true,
            color: '#cccccc',
          },
        ],
    noteEdited: {},
    formDialog: false,
    confirmationDialog: false,
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
    async saveNote({ current, edit }) {
      this.notes = this.notes.map((note) => {
        if (note === current) {
          return Object.assign(note, edit)
        }
        return note
      })
    },

    async deleteNote({ _id }) {
      // TODO: ASK FOR CONFIRMATION!!!
      this.notes = this.notes.filter((note) => {
        return note._id !== _id
      })
    },

    isColorDark(color) {
      const rgb = groupBy([...color.slice(1)], 2)
        .map((a) => a.join(''))
        .map((s) => parseInt(s, 16))
        .map((i) => i / 255.0)

      const lightness = [Math.max, Math.min]
        .map((f) => f.apply(null, rgb))
        .reduce((a, b) => (a + b) / 2, 0)

      return lightness >= 0.5
    },
    editNote(note) {
      this.noteEdited = Object.assign({}, note)
      this.formDialog = true
    },
    closeDialog() {
      this.noteEdited = {}
      this.formDialog = false
    },
    updateNote() {
      this.notes = this.notes.map((note) => {
        if (note._id === this.noteEdited._id) {
          return Object.assign(note, this.noteEdited)
        }
        return note
      })
    },
    openConfirmationDialog() {
      this.formDialog = false
      const interval = setInterval(
        function () {
          clearInterval(interval)
          this.confirmationDialog = true
        }.bind(this),
        250
      )
    },
    closeConfirmationDialog(value) {
      this.confirmationDialog = false
      const cb = function () {
        this.formDialog = true
      }.bind(this)
      if (value === true) {
        console.log('Confirmed!')
        this.deleteNote(this.noteEdited)
        this.noteEdited = {}
      } else {
        console.log('Phew.')
        const interval = setInterval(() => {
          clearInterval(interval)
          cb()
        }, 250)
      }
    },
  },
})
</script>
