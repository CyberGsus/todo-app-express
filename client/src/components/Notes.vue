<template>
  <v-container>
    <v-row justify="center">
      <NoteDialog
        :mode="noteFormMode"
        @keydown="dialogKeyDown"
        ref="noteForm"
        @note:delete:confirm="openConfirmationDialog"
        @note:update="updateNote"
        @note:edit:close="closeDialog"
        @note:dismiss="dismissNote"
        @note:submit="openConfirmationDialog($event, 'confirmAdd')"
      />
      <note-confirm :note="noteEdited" ref="confirm" :mode="confirmationDialogMode"
        @confirm:accept="closeConfirmationDialog(true)" @confirm:dismiss="closeConfirmationDialog(false)" @confirm:keydown="dialogKeyDown" />
      <!-- <v-dialog
        v-model="confirmationDialog"
        max-width="600px"
        @click:outside="closeConfirmationDialog(false)"
        @keydown="dialogKeyDown"
      >
        <v-card :color="confirmDialogColor" dark>
          <v-card-title class="heading mb-2">
            <v-row align="center">
              <v-col cols="1">
                <v-icon>mdi-alert</v-icon>
              </v-col>

              {{ confirmDialogTitle }}?
            </v-row>
          </v-card-title>
          <v-card-text color="white">
            <b v-if="confirmationDialogMode === 'delete'">
              Are you sure you want to delete note "{{ noteEdited.title }}" ?<br />
              This is unrecoverable!
            </b>
            <template v-else>
              <b
                >Are you sure you want to
                {{
                  confirmationDialogMode.endsWith('Add') ? 'submit' : 'discard'
                }}
                this note?</b
              >
              <v-row>
                <v-col cols="1" offset="1">
                  <NoteItem :note="noteEdited" />
                </v-col>
              </v-row>
            </template>
          </v-card-text>
          <v-divider />
          <v-card-actions
            :class="['pa-2', confirmDialogColor.split(' ')[0], 'darken-3']"
          >
            <v-btn text @click="closeConfirmationDialog(true)" color="white"
              ><v-icon>mdi-checkbox-marked-circle</v-icon>Yes</v-btn
            >
            <v-spacer />
            <v-btn text @click="closeConfirmationDialog(false)" color="white"
              >No <v-icon>mdi-cancel</v-icon></v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog> -->
      <!-- Confirmation dialog END -->
      <NoteItem
        v-for="note in notes"
        :key="note._id"
        :note="note"
        editable
        @note:edit="editNote"
        @note:delete="openConfirmationDialog($event, 'delete', false)"
        @note:update:silent="updateNote"
      />
    </v-row>
    <v-card-text style="height: 100px; position: relative;">
      <v-btn absolute dark fab top right color="pink" @click="newNote"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-text>
  </v-container>
</template>

<script>
import axios from 'axios'
import NoteItem from './NoteItem.vue'
import NoteDialog from './NoteDialog.vue'
import CardConfirm from './CardConfirm.vue'

const API_URI = 'http://localhost:8081/api/v1'

const config = {
  callAPI: false,
}

const sleepAsync = (millis = 1000) =>
  new Promise(resolve => setTimeout(resolve, millis))

export default {
  name: 'Notes',
  components: {
    NoteItem,
    NoteDialog,
    'note-confirm': CardConfirm,
  },
  data: () => ({
    notes: config.callAPI
      ? []
      : [
          {
            _id: 1, // will be the _id from mongodb
            title: 'Call Mom',
            description: `She must be very worried. I'd better call her`,
            color: '#ff0000',
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
    noteUpdated: false,
    noteEdited: {},
    noteFormMode: 'edit',
    confirmationDialogMode: 'delete',
    comingFromDialog: false,
  }),
  // async mounted() {
  //   this.getNotes()
  // },
  methods: {
    async dismissNote({ note, edited }) {
      console.log({ note, edited })
      if (edited) {
        this.openConfirmationDialog(note, 'confirmDismiss')
      } else {
        this.$refs.noteForm.close(true)
      }
    },
    async getNotes() {
      if (config.callAPI) {
        const resp = await axios.get(`${API_URI}/notes`)
        this.notes = resp.data
      } else {
        await sleepAsync(250)
      }
    },
    async createNote({ title, description, color }) {
      const note = { title, description, color }
      note._id =
        Math.max.apply(
          null,
          this.notes.map(n => n._id)
        ) + 1
      this.notes.push(note)
    },
    async saveNote({ current: { _id }, edit }) {
      this.notes = this.notes.map(note => {
        if (note._id === _id) {
          return Object.assign(note, edit)
        }
        return note
      })
    },

    async deleteNote({ _id }) {
      // TODO: ASK FOR CONFIRMATION!!!
      this.notes = this.notes.filter(note => {
        return note._id !== _id
      })
    },

    newNote() {
      this.noteFormMode = 'create'
      this.$refs.noteForm.open()
    },
    editNote(note) {
      this.noteFormMode = 'edit'
      this.noteEdited = Object.assign({}, note)
      this.$refs.noteForm.open(note)
    },
    closeDialog(removeNoteData = true) {
      this.$refs.noteForm.close(removeNoteData)
      if (this.noteUpdated) {
        this.$emit('alert:show', {
          mode: 'ok',
          text: `Note "<strong>${this.noteEdited.title}</strong>" updated`,
        })
        this.noteUpdated = false
      }
    },
    updateNote({ current: { _id }, edit }) {
      this.noteUpdated = true
      this.notes = this.notes.map(note => {
        if (note._id === _id) {
          return Object.assign(note, edit)
        }
        return note
      })
    },
    openConfirmationDialog(note, mode = 'delete', fromDialog = true) {
      this.confirmationDialogMode =
        ['delete', 'confirmDismiss', 'confirmAdd'].indexOf(mode) !== -1
          ? mode
          : this.confirmationDialogMode

      this.comingFromDialog = fromDialog
      this.noteEdited = Object.assign({}, note)
      if (fromDialog) {
        this.$refs.noteForm.close(false)
      }
      const interval = setInterval(
        function () {
          clearInterval(interval)
          this.$refs.confirm.open()
        }.bind(this),
        250
      )
    },
    closeConfirmationDialog(confirmed) {
      this.$refs.confirm.close()
      const cb = function () {
        this.$refs.noteForm.open()
      }.bind(this)
      if (confirmed === true) {
        // Confirmed
        this.closeDialog(false)
        this.afterConfirmation(this.noteEdited).then(
          function ([alert, alertVerb, noteEdited]) {
            if (alert) {
              this.$emit('alert:show', {
                mode: 'ok',
                text: `Note "<strong>${noteEdited.title}</strong>" ${alertVerb} successfully`,
              })
            }
            this.noteEdited = {}
          }.bind(this)
        )
        // TODO: add a catcher for API error
      } else if (this.comingFromDialog) {
        // Phew.
        const interval = setInterval(() => {
          clearInterval(interval)
          cb()
        }, 250)
      }
      this.noteUpdated = false
      this.comingFromDialog = false
    },
    dialogKeyDown({ key, keyCode }) {
      if (key.toLowerCase() === 'Escape' || keyCode === 27) {
        if (this.confirmationDialog) this.closeConfirmationDialog(false)
        else this.closeDialog()
      }
    },
    log: console.log,
  },
  computed: {
    confirmDialogTitle() {
      return {
        delete: 'Delete Note',
        confirmDismiss: 'Discard Note',
        confirmAdd: 'Save Note',
      }[this.confirmationDialogMode]
    },
    confirmDialogColor() {
      return {
        delete: 'red',
        confirmDismiss: 'blue darken-2',
        confirmAdd: 'green',
      }[this.confirmationDialogMode]
    },
    afterConfirmation() {
      const cb = {
        delete: [this.deleteNote, 'deleted'],
        confirmAdd: [this.createNote, 'created'],
        confirmDismiss: [() => false, null],
      }[this.confirmationDialogMode]

      return async note => {
        let answer = await cb[0](note)
        answer = typeof answer === 'boolean' ? answer : true
        return [answer, cb[1], note]
      }
    },
  },
}
</script>
