# client

The client side for the project,
using Vue and Vuetify. In development

## Setup

These are the steps to setup client-only mode:

1. Clone the repository

```bash
git clone https://github.com/CyberGsus/todo-app-express`
```

2. Go to the directory

```bash
cd todo-app-express/client
```

3. Install packages (`yarn` recommended)

```bash
yarn install
```

4. Have some fun!
   Use

```
yarn serve
```

to spin up the development environment

## :bug: Bugs

- [x] Fix dialog recursion when called 2nd time
- [x] Note does not update `done` property when clicked, if it has been recently added to the notes list
- [ ] Remove Vuetify styling for `<code>` tags on `NoteItem`s

## :notebook: TODO

- [x] Make a dialog for confirm deleting a note

  - [x] Actually delete the note

- [ ] Sort notes

  - [ ] By newest
  - [ ] By oldest

- [x] Filter notes

  - [x] By content
    - [x] Title
    - [x] Description
  - [x] By color
    - [x] Fetch all the colors
    - [x] Make menu to decide what color to filter

- [x] Add swatches from previous colors to the color picker

  > - [ ] Convert the color picker to swatch one & add color picker for new swatches

- [x] Create a button & form to add a new note

  - [x] Move form dialog to separate component `NoteDialog`
  - [x] Add a create button at the bottom of the page
  - [x] Make that button call the `create` mode for the form dialog
  - [x] Make `NoteDialog` switch between `edit` and `create` modes
  - [x] Should have a `NoteItem` to display the result either on dismiss or accept
  - [x] Should check title
  - [x] Should add the note to the list on confirmation

- [x] Separate the confirmation dialog into a new component

  - [x] Props

    - Title\* (required)
    - DismissMessage (default 'No')
    - AcceptText (default 'Yes')

  - [x] `<slot>` for message

  - [x] Re-assign events to connect back to `Notes`
    - [x] `confirm:dismiss`
    - [x] `confirm:accept`

- [x] Organize events

  - [x] `note:edit:close` to `note:dismiss`

- [ ] Better looking cards

  - [x] Make card description background a % lighter/darker color of the `note.color`
  - [x] Make card title background `note.color`
  - [x] Fix purple-ish cards
  - [ ] Fixed-width cards

- [ ] Code organization

  - [ ] Move all related `Note` stuff to `src/components/notes`
  - [ ] Move whatever I can away from `Notes.vue`

- [ ] Clean attachment to API via environment variable
- [ ] Make attachment to API actually work
  - [x] Use axios for each call
  - [ ] Catch errors and show them in alert
    - [ ] Create
    - [ ] Read
    - [ ] Update
    - [ ] Delete
