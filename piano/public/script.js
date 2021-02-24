const whites = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
const blacks = ['s', 'd', 'g', 'h', 'j']

const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
const saveButton = document.querySelector('.save-button')
const songLink = document.querySelector('.song-link')
const keys = document.querySelectorAll('.key');
const whiteKeys = document.querySelectorAll('.white')
const blackKeys = document.querySelectorAll('.black')

let recordingStartTime
let songNotes = currentSong && currentSong.notes

const keyMap = [...keys].reduce((map, key) => {
    map[key.dataset.note] = key
    return map
}, {})

keys.forEach(key => {
    key.addEventListener('click', () => playNote(key))
})
if (recordButton) {
    recordButton.addEventListener('click', toggleRecording)
}

playButton.addEventListener('click', playSong)

if (saveButton) {
    saveButton.addEventListener('click', saveSong)
}

function toggleRecording() {
    recordButton.classList.toggle('active')
    if (isRecording()) {
        startRecording()
    } else {
        stopRecording()
    }
}

function isRecording() {
    return recordButton != null && recordButton.classList.contains('active')
}

function startRecording() {
    recordingStartTime = Date.now()
    songNotes = []
    saveButton.classList.remove('show')
    playButton.classList.remove('show')
}

function stopRecording() {
    console.log(songNotes)
    saveButton.classList.add('show')
    playButton.classList.add('show')
}

function playSong() {
    if (songNotes.length == 0) return
    songNotes.forEach(note => {
        setTimeout(() => {
            playNote(keyMap[note.key])
        }, note.startTime)
    })
}


document.addEventListener('keydown', (e) => {
    if (e.repeat) return
    const key = e.key
    const whiteIndex = whites.indexOf(key)
    const blackIndex = blacks.indexOf(key)

    if (whiteIndex > -1) playNote(whiteKeys[whiteIndex])
    if (blackIndex > -1) playNote(blackKeys[blackIndex])
})

function playNote(key) {
    if (isRecording()) recordNote(key.dataset.note)
    const audio = document.getElementById(key.dataset.note)
    audio.currentTime = 0
    audio.play()
    key.classList.add('active')
    audio.addEventListener('ended', () => {
        key.classList.remove('active')
    })
}

function recordNote(key) {
    songNotes.push({
        key,
        startTime: Date.now() - recordingStartTime
    })
}

function saveSong() {
    axios.post('/songs', { songNotes: songNotes }).then(res => {
        console.log(res.data)
        songLink.classList.add('show')
        songLink.href = `/songs/${res.data._id}`
    })
}