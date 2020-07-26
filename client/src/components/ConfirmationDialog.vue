<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="600px"
    @click:outside="$emit('confirm:dismiss')"
    @keydown="$emit('confirm:keydown', $event)"
  >
    <v-card :color="cardColor" dark>
      <v-card-title class="heading mb-2">
        <v-row align="center">
          <v-col cols="1">
            <v-icon>mdi-alert</v-icon>
          </v-col>
          {{ cardTitle }}?
        </v-row>
      </v-card-title>
      <v-card-text color="white">
        <slot></slot>
      </v-card-text>
      <v-divider />
      <v-card-actions :class="['pa-2', cardColor.split(' ')[0], 'darken-3']">
        <v-btn text @click="$emit('confirm:accept')" color="white"
          ><v-icon>mdi-checkbox-marked-circle</v-icon>{{ confirmText }}</v-btn
        >
        <v-spacer />
        <v-btn text @click="$emit('confirm:dismiss')" color="white"
                                                      >{{ dismissText }}<v-icon>mdi-cancel</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/*
  mode: 'delete', 'add', 'dismiss'
*/
export default {
  name: 'ConfirmationDialog',
  props: {
    title: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Yes'
    },
    dismissText: {
      type: String,
      default: 'No'
    },
    // TODO: move this to open() method
    note: {
      title: {
        type: String,
        required: true,
        validator: val => val && val.trim().length > 3,
      },
      description: String,
      done: Boolean,
    },
    mode: {
      type: String,
      default: 'delete',
      validator: val => ['delete', 'add', 'dismiss'].indexOf(val) !== -1,
    },
  },
  data: () => ({
    dialogOpen: false,
  }),
  computed: {
    cardColor() {
      return {
        delete: 'red',
        dismiss: 'blue darken-2',
        add: 'green',
      }[this.mode]
    },
    cardTitle() {
      return {
        delete: 'Delete Note',
        dismiss: 'Discard Note',
        add: 'Save Note',
      }[this.mode]
    },
  },
  methods: {
    open() {
      this.dialogOpen = true
    },
    close() {
      this.dialogOpen = false
    },
  },
}
</script>
