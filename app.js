const express = require('express')
const fs = require('fs');
const path = require('path')

const port = process.env.PORT || 3000

const app = express()

app.use(express.json())

const mpdFilesLocation = path.join(__dirname, '..', 'mpd_files')

app.get('/files', async (req, res) => {
    fs.readdir(mpdFilesLocation, (err, files) => {
        if(!files) {
            console.log("Error: cannot access the mpd files directory")
            res.status(500).send()
        }

        files.filter((file) => {
            if(path.extname(file) != '.mpd'){
                return false;
            } else {
                return true;
            }
        })

        res.send({files: files})    
    });
    
})

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/index.htm')
})

app.get('/mpd_files/:id', async (req, res) => {
    const location = __dirname + '/mpd_files/' + req.params.id
    res.sendFile(location)
})

app.get('/videos/:id1/:id2/:id3', async (req, res) => {
    const location = __dirname + '/videos/' + req.params.id1 + '/' + req.params.id2 + '/' + req.params.id3
    res.sendFile(location)
})

app.get('/home/scheleon/node-course/:id', async(req, res) => {
    res.sendFile(req.params.id)
})

app.get('/:id', async (req, res) => {
    const location = __dirname + '/' + req.params.id
    res.sendFile(location)
})

app.listen(port, () => {
    console.log('Server is running on', port)
})