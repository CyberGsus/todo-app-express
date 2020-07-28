<template>
  <v-dialog v-model="dialogOpen" fullscreen @keydown="$emit('keydown', $event)">
    <v-card>
      <v-card-title class="heading mb-2 yellow lighten-2"
        >{{ mode === 'edit' ? 'Edit' : 'Add new' }} note</v-card-title
      >
      <v-card-text>
        <v-container fluid>
          <v-form v-model="formValid">
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field
                  label="Title"
                  required
                  :rules="titleRules"
                  v-model="noteEdited.title"
                  @keydown="noteWatch(noteEdited, true)"
                  outlined
                ></v-text-field>
                <v-textarea
                  clearable
                  v-model="noteEdited.description"
                  label="Description"
                  @keydown="noteWatch(noteEdited, true)"
                  outlined
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row justify="space-between">
              <v-col cols="9">
                <v-checkbox v-model="noteEdited.done" label="Done"></v-checkbox>
              </v-col>
              <v-spacer />
              <v-col>
                <v-color-picker
                  hide-inputs
                  @focus="noteWatch"
                  v-model="noteEdited.color"
                  mode="hexa"
                ></v-color-picker>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          v-if="mode === 'edit'"
          text
          @click="$emit('note:delete:confirm', noteCopy)"
          color="red lighten-2"
          >Delete note</v-btn
        >
        <v-spacer v-if="mode === 'edit'" />
        <v-btn
          text
          :disabled="!validForm"
          @click="greenButton"
          color="green lighten-1"
          >{{ mode === 'edit' ? 'Update' : 'Create' }} note</v-btn
        >
        <v-spacer v-if="mode === 'create'" />
        <v-btn
          text
          @click="
            $emit('note:dismiss', { note: noteEdited, edited: noteUpdated })
          "
          color="blue lighten-1"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import _ from 'lodash'
export default {
  name: 'NoteDialog',
  props: {
    mode: {
      type: String,
      required: true,
      validator: val => ['edit', 'create'].indexOf(val) !== -1,
    },
  },
  data: () => ({
    noteEdited: {
      title: '',
      description: '',
      color: '#ff0000',
    },
    dialogOpen: false,
    noteCopy: {},
    formValid: true,
    noteUpdated: false,
    updatedByProgram: false,
  }),
  created() {
    this.$watch.noteEdited = this.noteWatch // _.debounce(this.noteWatch, 30)
  },
  methods: {
    /**
     * @description
     *  If open is called with a note object,
     *  then setup is made. If not, data is the same
     *  as before. This is used for the delete confirmation
     *  dialog
     */
    open(note) {
      if (typeof note === 'object') {
        this.noteCopy = Object.assign({}, note)
        this.noteEdited = Object.assign({}, note)
        this.noteUpdated = false
        this.updatedByProgram = true
      }

      this.dialogOpen = true
    },
    close(removeNoteData = true) {
      this.dialogOpen = false
      const lastEdit = Object.assign({}, this.noteEdited)
      if (removeNoteData) {
        this.noteEdited = {}
        this.updatedByProgram = true
        this.noteUpdated = false
      }
      this.$emit('note:form:close')
      return [this.noteCopy, lastEdit]
    },
    // TODO: this not getting called on textarea @keydown
    noteWatch(val, force = false) {
      if (this.updatedByProgram) {
        this.updatedByProgram = false
        if (!force) return
      }
      if (!this.noteUpdated) this.noteUpdated = true
      if (typeof val.color === 'object') val.color = val.color.hex
      this.noteEdited = val
    },
    greenButton() {
      if (this.mode === 'edit') {
        this.noteUpdated = false
        this.$emit('note:update', {
          current: this.noteCopy,
          edit: this.noteEdited,
        })
      } else {
        this.$emit('note:submit', this.noteEdited)
      }
    },
  },
  computed: {
    titleRules() {
      return [
        v =>
          (v && v.trim().length > 2) || 'Please be meaningful on your titles!',
      ]
    },
    validForm() {
      return this.formValid && this.noteUpdated
    },
  },
}
</script>
