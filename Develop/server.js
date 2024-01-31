// required packages
const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001

// initiate server
const app = express();

// middleware
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));

// view route to return notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// GET /api/notes should read db.json and return all saved notes 
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            res.send(results);
        }
    });
})

// POST /api/notes should receive new note on the req.body and add to db.json and return the new note to client
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            let existingNotes = JSON.parse(results);
            let newNotes = req.body;
            // each note should have unique ID when saved
            let noteLength = (existingNotes.length).toString();
            newNotes.id = noteLength;
            // pushing updated notes with ids to existing notes array
            existingNotes.push(newNotes);
            // writing to file updated notes array
            fs.writeFile('./db/db.json', JSON.stringify(existingNotes), (err) => {
                if (err) {
                    throw err
                } else {
                    res.send('File created!');
                }
            });
        };
    });
});

    // view route to return user to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// BONUS TODO: create delete route
// DELETE /api/notes/:id should receive query parameter containing the id note to delete
// will need to read all notes from the db.json file, remove note with given id, and rewrite notes to db.json file
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            let existingNotes = JSON.parse(results);
            let noteIds = req.params.id.toString();
            const newNoteArr = existingNotes.filter(note => note.id.toString() !== noteIds);
            // writing to file updated notes array
            fs.writeFile('./db/db.json', JSON.stringify(newNoteArr), (err) => {
                if (err) {
                    throw err
                } else {
                    res.json(newNoteArr);
                }
            });
        };
    });
});

// having server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});