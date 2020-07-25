<template>
  <v-col cols="6" sm="12" md="6" lg="3" class="ma-3" align-self="center">
    <!-- Note card -->
    <v-card
      min-width="400px"
      max-width="600px"
      :dark="isLightColor(note.color)"
    >
      <v-container>
        <v-card-title class="headline mb-1">
          <v-row>
            <v-col cols="8">
              {{ note.title }}
            </v-col>
            <v-col cols="1">
              <v-avatar :color="note.color" tile />
            </v-col>
            <v-col offset="2" cols="1">
              <v-icon v-if="note.done" color="green">mdi-check-bold</v-icon>
            </v-col>
          </v-row>
        </v-card-title>
      </v-container>
      <v-divider />
      <v-row class="px-3">
        <v-card-text>
          <v-col cols="10">
            <p>{{ note.description }}</p>
          </v-col>
        </v-card-text>
      </v-row>
      <v-card-actions v-if="editable">
        <v-btn
          text
          :color="note.color"
          @click="$emit('note:edit', note)"
          >Edit
        </v-btn>
        <v-spacer />
          <v-btn text icon color="red lighten-2" @click="$emit('note:delete', note)"><v-icon>mdi-delete</v-icon></v-btn>
      </v-card-actions>
    </v-card>
    <!-- Note card END -->
  </v-col>
</template>

<script>
import { getColorLightness } from '../helpers/colors'
export default {
  name: 'NoteItem',
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    note: {
      title: {
        type: String,
        required: true,
        validator: function (value) {
          return value.trim().length > 0
        },
      },
      description: {
        type: String,
        default: 'No description provided',
      },
      done: {
        type: Boolean,
        default: false,
      },
      color: {
        type: String,
        validator: function (value) {
          return /^#(?:[0-9a-f]{3}){1,2}$/i.test(value)
        },
      },
    },
  },
  data: () => ({
    formDialog: false,
    noteEdited: {
      title: '',
      description: '',
      done: false,
      color: '#000',
    },
  }),
  methods: {
    isLightColor(color) {
      return getColorLightness(color) > 0.5
    },
    deleteNote() {
      console.log('Delete note', this.note)
      console.log('Maybe a confirmation dialog???')
    },
    saveNote() {
      console.log('Saving note', this.note)
      // emit an event to save the note
    },
  },
}
</script>
