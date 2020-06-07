function transcode(inputFile, outputDirectory, outputFileNamePrefix, currentBitrate, mpdLocation, currentDirectory) {
    const exec = require('child_process').exec;

        const child = exec(
                __dirname + '/scripts/video_transcoder.sh ' + 
                inputFile + ' ' + 
                outputDirectory + ' ' + 
                outputFileNamePrefix + ' ' + 
                currentBitrate.toString() + ' ' +
                mpdLocation + ' ' +
                currentDirectory,
                    function (error, stdout, stderr) {
                        if(stderr){
                            console.log(stderr)
                        }
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    });

        child
}

module.exports = transcode