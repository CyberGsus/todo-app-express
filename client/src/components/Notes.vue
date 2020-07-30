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
        @note:delete:confirm="openConfirmationDialog($event, 'delete')"
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
            lg="4"
          >
            <NoteItem
              :note="note"
              editable
              @note:edit="editNote"
              @note:delete="openConfirmationDialog($event, 'delete', false)"
              @note:update:silent="saveNote($event, true)"
            />
          </v-col>

          <v-col sm="12" md="6" lg="4">
            <NoteItem dummy @note:add="newNote" />
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

  const API_URI = '/api/v1'


  export default {
    name: 'Notes',
    components: {
      NoteItem,
      NoteDialog,
      'note-confirm': CardConfirm
    },
    data: () => ({
      notes: [],
      searchTerm: '',
      noteUpdated: false,
      noteEdited: {},
      noteFormMode: 'edit',
      confirmationDialogMode: 'delete',
      confirmationDialog: false,
      comingFromDialog: false,
      selectedColor: null,
      callAPI: false
    }),
    mounted() {
        axios
          .get(API_URI)
          .then(() => {
            // this.$emit('alert:show', { mode: 'ok', text: 'Backend is up!' })
            this.callAPI = true
            this.getNotes()
          })
          .catch(err => {
            console.error(err)
            this.$emit('alert:show', {
              mode: 'alert',
              text: 'Sorry, backend could not be reached!'
            })
            this.callAPI = false
          })
    },
    methods: {
      async dismissNote({ note, edited }) {
        if (edited) {
          this.openConfirmationDialog(note, 'dismiss')
        } else {
          this.$refs.noteForm.close(true)
        }
      },
      getNotes() {
        if (this.callAPI) {
          return axios
            .get(`${API_URI}/notes`)
            .then(
              function (response) {
                this.notes = response.data
              }.bind(this)
            )
            .catch(
              function () {
                this.$emit('alert:show', {
                  mode: 'error',
                  text: 'Could not fetch notes'
                })
              }.bind(this)
            )
        } else {
          return new Promise(resolve => resolve(true))
        }
      },
      createNote({ title, description, color, done }) {
        if (this.callAPI) {
          return axios
            .post(`${API_URI}/notes`, { title, description, color, done })
            .then(
              function (resp) {
                this.notes.push(resp.data)
              }.bind(this)
            )
            .catch(
              function (err) {
                console.error({ from: 'create', err })
                this.$emit('alert:show', {
                  mode: 'error',
                  text: '<strong>Error at creating note!</strong>'
                })
              }.bind(this)
            )
        } else {
          const note = { title, description, color, done }
          note._id =
            Math.max.apply(
              null,
              this.notes.map(n => n._id)
            ) + 1
          this.notes.push(note)
          return new Promise(resolve => resolve(true)) // instant resolution
        }
      },
      saveNote(edit, silent = false) {
        const { _id } = edit
        if (this.callAPI) {
          return axios
            .put(`${API_URI}/notes`, edit)
            .then(
              function ({ data: saved }) {
                this.notes = this.notes.map(note => {
                  if (note._id === saved._id) {
                    return Object.assign({}, saved)
                  }
                  return note
                })
                return !silent
              }.bind(this)
            )
            .catch(
              function (err) {
                console.error({ from: 'update', err })
                this.$emit('alert:show', {
                  mode: 'error',
                  text: `Could not update "<strong>${edit.title}</strong>"`
                })
              }.bind(this)
            ) // TODO: update local copy of data
        } else {
          this.noteUpdated = true
          this.notes = this.notes.map(note => {
            if (note._id === _id) {
              return Object.assign({}, edit)
            }
            return note
          })
          return new Promise(resolve => resolve(true))
        }
      },

      deleteNote(note) {
        const { _id } = note
        if (this.callAPI) {
          return axios
            .delete(`${API_URI}/notes/${_id}`)
            .then(this.getNotes)
            .catch(
              function (err) {
                console.error({ from: 'delete', err })
                this.$emit('alert:show', {
                  mode: 'error',
                  text: `Could not delete "<strong>${note.title}</strong>" `
                })
              }.bind(this)
            )
        } else {
          this.notes = this.notes.filter(note => {
            return note._id !== _id
          })
          return new Promise(resolve => resolve(true))
        }
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
            text: `Note "<strong>${this.noteEdited.title}</strong>" updated`
          })
          this.noteUpdated = false
        }
      },
      closeDialog(removeNoteData = true) {
        this.$refs.noteForm.close(removeNoteData)
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
                  text: `Note "<strong>${noteEdited.title}</strong>" ${alertVerb} successfully`
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
      }
    },
    computed: {
      colors() {
        return [...new Set(this.notes.map(n => n.color))]
      },
      swatches() {
        return this.colors
          .filter((_, i) => i % 3 === 0)
          .map((_, i) => ((i *= 3), this.colors.slice(i, i + 3)))
      },
      confirmDialogTitle() {
        return {
          delete: 'Delete Note',
          dismiss: 'Discard Note',
          add: 'Save Note'
        }[this.confirmationDialogMode]
      },
      confirmDialogColor() {
        return {
          delete: 'red',
          dismiss: 'blue darken-2',
          add: 'green'
        }[this.confirmationDialogMode]
      },
      addMethod() {
        return this[
          {
            edit: 'saveNote',
            create: 'createNote'
          }[this.noteFormMode]
        ]
      },
      afterConfirmation() {
        const cb = {
          delete: [this.deleteNote, 'deleted'],
          add: [this.addMethod, 'created'],
          dismiss: [() => false, null]
        }[this.confirmationDialogMode]

        return async note => {
          let answer = await cb[0](note)
          answer = typeof answer === 'boolean' ? answer : true
          return [answer, cb[1], note]
        }
      },
      filteredNotes() {
        return this.notes.filter(this.isIncluded)
      }
    }
  }
</script>
