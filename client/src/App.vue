<template>
  <v-app>
    <v-row justify="center">
      <v-container>
        <v-row>
          <v-dialog
            v-model="formDialog"
            max-width="600px"
            v-for="note in notes"
            :key="note._id"
          >
            <!-- Note card -->
            <template v-slot:activator="{ on, attrs }" class="mb-3">
              <v-card
                max-width="600px"
                :loading="
                  formDialog && notes.indexOf(note) === noteIndex
                    ? note.color
                    : false
                "
              >
                <v-container>
                  <v-card-title class="headline mb-1">
                    {{ note.title }}
                  </v-card-title>
                </v-container>
                <v-divider />
                <v-row class="px-3">
                  <v-card-text>
                    {{ note.description }}
                  </v-card-text>
                </v-row>
                <v-card-actions>
                  <v-btn
                    text
                    color="orange lighten-1"
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
                      <v-color-picker
                        hide-inputs
                        :value="noteBeingEdited.color"
                      >
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
      </v-container>
    </v-row>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
// import _ from 'lodash'

const API_URI = 'http://localhost:8081/api/v1'

export default Vue.extend({
  name: 'App',
  data: () => ({
    notes: [],
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
  created() {
    this.submitNote = this.wrapApiCall(this.submitNote)
  },
  async mounted() {
    this.getNotes()
  },
  methods: {
    wrapApiCall(original) {
      const callback = async function(...args) {
        this.updatingData = true
        await original(...args)
        await this.getNotes()
        this.updatingData = false
      }
      return callback.bind(this)
    },
    async getNotes() {
      const resp = await axios.get(`${API_URI}/notes`)
      this.notes = resp.data
    },
    async submitNote() {
      try {
        await axios.put(`${API_URI}/notes/`, this.noteBeingEdited)
      } catch (err) {
        console.error(err)
      }
    },
    async deleteNote(note) {
      try {  
      await axios({
        method: 'delete',
        url: `${API_URI}/notes/${note._id}`
      })
      } catch (err) { console.error(err) }},
    isDark(color) {
      if (!/^#[0-9a-f]{6}$/i.test(color)) {
        console.log('CSS color: ', color)
      } else {
        console.log('HEX color: ', color)
      }
    }
  }
})
</script>
