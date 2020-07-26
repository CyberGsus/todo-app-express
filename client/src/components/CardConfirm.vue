<template>
  <confirm-dialog :mode="mode" ref="innerDialog" v-on="$listeners">
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
import ConfirmationDialog from './ConfirmationDialog'
export default {
  name: 'CardConfirm',
  props: {
    note: {
      title: {
        type: String,
        required: true,
        validator: val => val && val.trim().length > 3,
      },
      description: String,
      done: Boolean,
    },
    mode: String,
  },
  components: {
    'confirm-dialog': ConfirmationDialog,
  },
  methods: {
    open() {
      this.$refs.innerDialog.open()
    },
    close() {
      this.$refs.innerDialog.close()
    },
  },
}
</script>
