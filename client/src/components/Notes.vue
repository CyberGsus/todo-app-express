<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="4">
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click.native="!false"
              :color="selectedColor === null ? 'white' : selectedColor"
              v-bind="attrs"
              v-on="on"
              :dark="selectedColor !== null && !isLightColor(selectedColor)"
              >Filter by color</v-btn
            >
          </template>
          <v-list>
            <v-list-item v-for="color in colors" :key="color">
              <v-btn
                @click.native="selectedColor = color"
                :color="color"
              ></v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                @click.native="selectedColor = null"
                depressed
                tile
                color="white"
              >
                <v-icon>mdi-close</v-icon><span>No filter</span>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="5" sm="5" md="7" lg="8">
        <v-text-field
          class="mt-8"
          v-model="searchTerm"
          filled
          rounded
          placeholder="Search your notes..."
          prepend-inner-icon="mdi-magnify"
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <NoteDialog
        :mode="noteFormMode"
        :colorSwatches="swatches"
        @keydown="dialogKeyDown"
        ref="noteForm"
        @note:delete:confirm="openConfirmationDialog"
        @note:update="saveNote"
        @note:edit:close="closeDialog"
        @note:dismiss="dismissNote"
        @note:submit="openConfirmationDialog($event, 'add')"
        @note:form:close="onDialogClose"
      />
      <note-confirm
        :note="noteEdited"
        ref="confirm"
        :mode="confirmationDialogMode"
        v-if="confirmationDialog"
        @confirm:accept="closeConfirmationDialog(true)"
        @confirm:dismiss="closeConfirmationDialog(false)"
        @confirm:keydown="dialogKeyDown"
      />
      <v-card-text class="grey lighten-4">
        <v-row>
          <v-col
            v-for="note in filteredNotes"
            :key="note._id"
            sm="12"
            md="6"
            lg="6"
          >
            <NoteItem
              :note="note"
              editable
              @note:edit="editNote"
              @note:delete="openConfirmationDialog($event, 'delete', false)"
              @note:update:silent="saveNote"
            />
          </v-col>

          <v-col sm="12" md="6" lg="6">
            <NoteItem
              dummy
              @note:add="newNote"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import NoteItem from './NoteItem.vue'
import NoteDialog from './NoteDialog.vue'
import CardConfirm from './CardConfirm.vue'
import convert from 'color-convert'

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
            //  color: '#ff0000',
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
    searchTerm: '',
    noteUpdated: false,
    noteEdited: {},
    noteFormMode: 'edit',
    confirmationDialogMode: 'delete',
    confirmationDialog: false,
    comingFromDialog: false,
    selectedColor: null,
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
        let tmp = note
        if (note._id === _id) {
          tmp = Object.assign(note, edit)
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
    isIncluded(note) {
      return (
        [note.title, note.description]
          .map(a => a.toLowerCase())
          .reduce(
            (a, b) => a || b.includes(this.searchTerm.toLowerCase()),
            false
          ) &&
        (this.selectedColor === null ||
          note.color.toLowerCase() === this.selectedColor.toLowerCase())
      )
    },
    log: console.log,
    isLightColor(c) {
      return convert.hex.hsl(c)[2] > 40
    },
  },
  computed: {
    colors() {
      return [...new Set(this.notes.map(n => n.color))]
    },
    swatches() {
      return this.colors
        .filter((_, i) => i % 3 === 0)
        .map((_, i) => (i *= 3, this.colors.slice(i, i + 3)))
    },
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
    filteredNotes() {
      return this.notes.filter(this.isIncluded)
    },
  },
}
</script>
