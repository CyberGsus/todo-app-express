# Server

The backend code for the application.
Used as an API, could attach a static
file server to it as well.

## How to use

### Structure of a note

A note has the following structure:

```json
{
  "_id": "some_mongodb_id",
  "title": "Create documentation",
  "description": "Create the documentation,\nadd methods",
  "done": true,
  "color": "#0afaba"
}
```

### Methods & endpoints

The API supports the following methods:

- [`GET`](#get)
- [`POST`](#post)
- [`PUT`](#put)
- [`DELETE`](#delete)

#### `GET`

The `GET` method is used to get note information. There are two endpoints:

- `/api/v1/notes` Returns an array of all the notes in the database.
- `/api/v1/notes/:id` Returns a single note, searched by id.

Both endpoints use the [note structure](#structure-of-a-note) given above

#### `POST`

The `POST` method adds a note to the database.<br>
Its endpoint is `/api/v1/notes`.
The structure of a POST request to `/api/v1/notes` should be like the [default
structure](#structure-of-a-note), omitting the `_id` parameter

- `title`

  - The only required item in a note.
  - Must have more than 3 non-whitespace charcters

- `description`

  - Optional
  - Can be empty or omitted

- `done`

  - Boolean, `true` or `false`
  - Can be omitted

- `color`
  - String, must be in the format of `#RRGGBB`

#### `PUT`

The `PUT` method allows to modify a note. Request to `/api/v1/notes` should
include the [full structure](#structure-of-a-note) of the given note.

#### `DELETE`

The `DELETE` method allows to (oh surprise!) delete a note. The `:id` param
should match the `_id` property given by a `GET` request
