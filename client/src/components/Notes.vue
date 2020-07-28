<template>
  <v-container>
    <v-row justify="center">
      <NoteDialog
        :mode="noteFormMode"
        @keydown="dialogKeyDown"
        ref="noteForm"
        @note:delete:confirm="openConfirmationDialog"
        @note:update="saveNote"
        @note:edit:close="closeDialog"
        @note:dismiss="dismissNote"
        @note:submit="openConfirmationDialog($event, 'add')"
        @note:form:close="onDialogClose"
      />
      <note-confirm :note="noteEdited" ref="confirm" :mode="confirmationDialogMode" v-if="confirmationDialog"
        @confirm:accept="closeConfirmationDialog(true)" @confirm:dismiss="closeConfirmationDialog(false)" @confirm:keydown="dialogKeyDown" />
      <NoteItem
        v-for="note in notes"
        :key="note._id"
        :note="note"
        editable
        @note:edit="editNote"
        @note:delete="openConfirmationDialog($event, 'delete', false)"
        @note:update:silent="saveNote"
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
    confirmationDialog: false,
    comingFromDialog: false,
  }),
  // async mounted() {
  //   this.getNotes()
  // },
  methods: {
    async dismissNote({ note, edited }) {
      if (edited) {
        this.openConfirmationDialog(note, 'dismiss')
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
      this.noteUpdated = true
      this.notes = this.notes.map(note => {
        if (note._id === _id) {
          return Object.assign({}, edit)
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
    onDialogClose() {

      if (this.noteUpdated) {
        this.$emit('alert:show', {
          mode: 'ok',
          text: `Note "<strong>${this.noteEdited.title}</strong>" updated`,
        })
        this.noteUpdated = false
      }
    },
    closeDialog(removeNoteData = true) {
      this.$refs.noteForm.close(removeNoteData)
    },
    updateNote({ current: { _id }, edit }) {
      this.noteUpdated = true
      this.notes = this.notes.map(note => {
        let tmp  = note
        if (note._id === _id) {
          tmp =  Object.assign(note, edit)
        }
        return tmp 
      })
    },
    openConfirmationDialog(note, mode = 'delete', fromDialog = true) {
      this.confirmationDialog = true
      this.confirmationDialogMode =
        ['delete', 'dismiss', 'add'].indexOf(mode) !== -1
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
      this.confirmationDialog = false
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
        dismiss: 'Discard Note',
        add: 'Save Note',
      }[this.confirmationDialogMode]
    },
    confirmDialogColor() {
      return {
        delete: 'red',
        dismiss: 'blue darken-2',
        add: 'green',
      }[this.confirmationDialogMode]
    },
    afterConfirmation() {
      const cb = {
        delete: [this.deleteNote, 'deleted'],
        add: [this.createNote, 'created'],
        dismiss: [() => false, null],
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
