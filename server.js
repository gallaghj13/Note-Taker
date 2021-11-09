const express = require('express');
const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const util = require('util');
const uniqid = require('uniqid'); 
const db = require('./db/db.json');
// const uuid = require('./helpers/uuid'); 

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET /api/notes should read the db.json file and return all saved notes as JSON.
// GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
  console.log("notes");
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

// GET * should return the index.html file.
router.get('*', (req, res) => {
  console.log("get *");
  res.sendFile(path.join(__dirname, './public/index.html'))
})


const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
 const writeToFile = (destination, content) =>
 fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
   err ? console.error(err) : console.info(`\nData written to ${destination}`)
 );

 /**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */
 const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.get('/api/notes', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);
// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;


  if (req.body) {
    const newNote = {
      title,
      text,
      id: uniqid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(newNote);
  }
});
// Bonus: DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete. To delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
app.delete('/api/notes/:id', (req, res) => {
  const userId = req.params.id;
  console.log(req.params.id)
  // console.log(readFromFile('./db/db.json').then((data) => console.log(JSON.parse(data))))
  readFromFile('./db/db.json').then((data) => JSON.parse(data))
  .then((notes) => notes.filter((note) => note.id !== userId))
  .then((filteredNotes) =>  writeToFile('./db/db.json', filteredNotes))
  .then(() => res.json({ok: true}))
  .catch((err) => res.status(500).json(err))
  // filter or splice from the db.json
})



app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

