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

## TODO

- [x] Fix dialog recursion when called 2nd time
- [x] Make a dialog for confirm deleting a note
  - [x] Actually delete the note
- [ ] Convert the color picker to swatch one & add color picker for new swatches

  - **Note**: This requires the front-end to fetch all colors from notes and sort
    by unique

- [x] Create a button & form to add a new note

  - [x] Move form dialog to separate component `NoteDialog`
  - [x] Add a create button at the bottom of the page
  - [x] Make that button call the `create` mode for the form dialog
  - [x] Make `NoteDialog` switch between `edit` and `create` modes
  - [x] Should have a `NoteItem` to display the result either on dismiss or accept
  - [x] Should check title
  - [x] Should add the note to the list on confirmation

- [ ] Separate the confirmation dialog into a new component

  - [ ] Props

    - Color (default 'white')
    - Title\* (required)
    - DismissMessage (default 'No')
    - AcceptText (default 'Yes')

  - [ ] `<slot>` for message

  - [ ] Re-assign events to connect back to `Notes`
    - [ ] `confirmation:dismiss`
    - [ ] `confirmation:accept`

- [ ] Organize events

  - [ ] `note:edit:close` to `note:dismiss`

- [ ] Better looking cards

  - [ ] Make card description background a % lighter/darker color of the `note.color`
  - [ ] Make card title background `note.color`

- [ ] Clean attachment to API via environment variable
- [ ] Make attachment to API actually work
