const express = require('express')
const mongoose = require('mongoose')
const Song = require('./models/song')
const app = express()

mongoose.connect('mongodb+srv://abhey1996:abhey1996@cluster1.vfp1y.mongodb.net/songRecorder?retryWrites=true&w=majority', {
    useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true
}, () => {
    console.log("db connected")
})
app.use(express.json())

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/songs', async (req, res) => {
    const song = new Song({
        notes: req.body.songNotes
    })

    await song.save()

    res.send(song)
})

app.get('/songs/:id', async (req, res) => {
    let song
    try {
        song = await Song.findById(req.params.id)
    } catch (error) {
        song = undefined
    }
    res.render('index', { song: song })
})

app.listen(5000)