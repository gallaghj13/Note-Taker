const express = require('express');
const path = require('path');
var uniqid = require('uniqid'); 
const api = require('./db/db.json');
const app = express();
const PORT = 3001;

app.use('/api', api);
// GET /notes should return the notes.html file.
app.use(express.static('public'));

app.get('/', (req, res) => res.send('Navigate to /notes or /*'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);
// GET * should return the index.html file.
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) =>
  readFromFile('./db.json').then((data) => res.json(JSON.parse(data)))
);
// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

// Bonus: DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);