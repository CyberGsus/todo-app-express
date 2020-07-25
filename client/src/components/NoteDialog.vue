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
                  outlined
                ></v-text-field>
                <v-textarea
                  clearable
                  v-model="noteEdited.description"
                  label="Description"
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
          :disabled="!formValid"
          @click="
            mode === 'edit'
              ? $emit('note:update', {
                  current: noteCopy,
                  edit: noteEdited,
                })
              : $emit('note:submit', noteEdited)
          "
          color="green lighten-1"
          >{{ mode === 'edit' ? 'Update' : 'Create' }} note</v-btn
        >
        <v-spacer v-if="mode === 'create'" />
        <v-btn
          text
          @click="
            mode === 'edit'
              ? $emit('note:edit:close')
              : $emit('note:dismiss', noteEdited)
          "
          color="blue lighten-1"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash'
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
  }),
  watch: {
    noteEdited: _.debounce(function (val) {
      if (typeof val.color === 'object') val.color =  val.color.hex
      this.noteEdited = val
    }.bind(this), 500)
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
      }

      this.dialogOpen = true
    },
    close(removeNoteData = true) {
      this.dialogOpen = false
      const lastEdit = Object.assign({}, this.noteEdited)
      if (removeNoteData) {
        this.noteEdited = {}
      }
      return [this.noteCopy, lastEdit]
    },
  },
  computed: {
    titleRules() {
      return [
        v =>
          (v && v.trim().length > 2) ||
          'Please be meaningful on your titles!',
      ]
    },
  },
}
</script>
