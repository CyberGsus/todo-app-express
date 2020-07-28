<template>
  <confirm-dialog
    :mode="mode"
    ref="innerDialog"
    v-on="$listeners"
    :title="cardTitle"
    :color="cardColor"
  >
    <b v-if="mode === 'delete'">
      Are you sure you want to delete note "{{ note.title }}"?<br />
      This is unrecoverable!
    </b>
    <template v-else>
      <b
        >Are you sure you want to
        {{ mode === 'add' ? 'submit' : 'discard' }}
        this note?</b
      >
      <v-row>
        <v-col cols="1" offset="1">
          <NoteItem :note="note" />
        </v-col>
      </v-row>
    </template>
  </confirm-dialog>
</template>

<script>
  import NoteItem from './NoteItem'
  import ConfirmationDialog from './ConfirmationDialog'
  export default {
    name: 'CardConfirm',
    props: {
      note: {
        title: {
          type: String,
          required: true,
          validator: val => val && val.trim().length > 3
        },
        description: String,
        done: Boolean
      },
      mode: {
        type: String,
        default: 'delete',
        validator: val => ['delete', 'add', 'dismiss'].indexOf(val) !== -1
      }
    },
    components: {
      'confirm-dialog': ConfirmationDialog,
      NoteItem
    },
    computed: {
      cardTitle() {
        return {
          delete: 'Delete Note',
          dismiss: 'Discard Note',
          add: 'Save Note'
        }[this.mode]
      },
      cardColor() {
        return {
          delete: 'red',
          dismiss: 'blue darken-2',
          add: 'green'
        }[this.mode]
      }
    },
    methods: {
      open() {
        this.$refs.innerDialog.open()
      },
      close() {
        this.$refs.innerDialog.close()
      }
    }
  }
</script>
