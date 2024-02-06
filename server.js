
const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001


const app = express();


app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            res.send(results);
        }
    });
})


app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            let existingNotes = JSON.parse(results);
            let newNotes = req.body;
            
            let noteLength = (existingNotes.length).toString();
            newNotes.id = noteLength;
            
            existingNotes.push(newNotes);
            
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

    
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            let existingNotes = JSON.parse(results);
            let noteIds = req.params.id.toString();
            const newNoteArr = existingNotes.filter(note => note.id.toString() !== noteIds);
            
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


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});