<template>
  <v-row justify="center">
    <v-dialog
      v-model="formDialog"
      max-width="600px"
      v-for="note in notes"
      :key="note._id"
    >
      <!-- Note card -->
      <template v-slot:activator="{ on, attrs }" class="mb-3">
        <v-card
          min-width="400px"
          max-width="700px"
          :loading="
            formDialog && notes.indexOf(note) === noteIndex ? note.color : false
          "
          :dark="isColorDark(note.color)"
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
                <p>
                  {{ note.description }}
                </p>
              </v-col>
            </v-card-text>
          </v-row>
          <v-card-actions>
            <v-btn
              text
              :color="note.color"
              v-on="on"
              @click="
                noteBeingEdited = Object.assign({}, note)
                noteIndex = notes.indexOf(note)
              "
              v-bind="attrs"
              >Edit note</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>

      <!-- Edit note form -->
      <v-card>
        <v-card-title class="heading mb-2 yellow lighten-2">
          Edit note
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Title"
                  required
                  v-model="noteBeingEdited.title"
                  outlined
                ></v-text-field>
                <v-textarea
                  clearable
                  v-model="noteBeingEdited.description"
                  outlined
                  label="Description"
                >
                </v-textarea>
              </v-col>
              <v-col cols="6" align="center">
                <v-checkbox
                  v-model="noteBeingEdited.done"
                  label="Done"
                  outlined
                >
                </v-checkbox>
              </v-col>
              <v-col cols="6">
                <v-color-picker hide-inputs v-model="noteBeingEdited.color">
                </v-color-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn @click="deleteNote(note)" text color="red lighten-2"
            >Delete note</v-btn
          >
          <v-spacer />
          <!-- TODO: make "submit" button -->
          <v-btn @click="submitNote()" text color="green lighten-1"
            >Save Note</v-btn
          >
          <v-btn
            @click="
              formDialog = false
              noteBeingEdited = {}
              noteIndex = -1
            "
            text
            color="blue lighten-1"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>


<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
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
  data: () => ({
    notes: config.callAPI
      ? []
      : [
          {
            title: 'Call Mom',
            description: `She must be very worried. I'd better call her`,
            color: '#ffaf00',
            done: false
          },
          {
            title: 'Hello World',
            description: 'I am a teapot!',
            done: true,
            color: '#ffffff'
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
