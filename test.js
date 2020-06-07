const transcode = require('./transcode')
const path = require('path')

const inputFile = 'uploads/sample.mp4'
const outputFolder = 'videos/sample'
const mpdLocation = 'mpd_files'

transcode(inputFile, outputFolder, 'sample', 1600, mpdLocation, __dirname)
