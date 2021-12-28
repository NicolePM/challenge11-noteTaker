const express = require('express');
const path = require("path");
const fs = require("fs");
const util = require("util");
const { v4: uuidv4 } = require('uuid');

//Async process handling reading from file
const readFile = util.promisify(fs.readFile);
const writeFile =util.promisify(fs.writeFile);

//Set up server
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Middleware
app.use(express.static("./public"));

//API Route| GET
app.get("/api/notes", function(req, res) {
    readFile("./db/db.json", "utf8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

//API Post
app.post("/api/notes", function(req, res) {
    const note =req.body;
    readFile("./db/db.json", "utf8").then(function(data) {
        const notes =[].concat(JSON.parse(data));
        note.id=uuidv4();
        notes.push(note);
        return notes
    }).then(function(notes) {
        writeFile("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

//API Delete
app.delete("/api/notes/:id", function(req, res) {
   // const noteID_toDelete = JSON.parse(req.params.id);
    readFile("./db/db.json", "utf8").then(function(data) {
        const notes =[].concat(JSON.parse(data));
        const newNotes = []
        for(let i = 0; i< notes.length; i++){
            if(req.params.id !== notes[i].id){
                newNotes.push(notes[i])
            }
        }
        return newNotes
}).then(function(notes) {
    writeFile("./db/db.json", JSON.stringify(notes))
res.send("Test: Saved!");
})
})

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});