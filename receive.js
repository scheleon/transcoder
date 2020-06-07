const amqp = require('amqplib/callback_api')
const path = require('path')
const transcode = require('./transcode')

const inputFolder = 'uploads'
const outputFolder = 'videos'
const mpdLocation = 'mpd_files'

while(true){
  amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = 'uploadAlert';

      channel.assertQueue(queue, {
        durable: false
      });

      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
      channel.consume(queue, function(msg) {
          const filename = msg.content.toString()
          console.log(" [x] Received %s", filename);

          const inputFileLocation = inputFolder + '/' + filename

          const exec = require('child_process').exec;

          const child = exec('ffprobe -i ' + inputFileLocation +' -v quiet -print_format json -show_format -show_streams',
              function (error, stdout, stderr) {
                  var videoDetailsObject = JSON.parse(stdout)
                  const currentBitrateInKbps = Math.ceil(Number(videoDetailsObject.streams[0].bit_rate) / 1024)
                  console.log("Current video bit-rate" + currentBitrateInKbps)

                  transcode(inputFileLocation, outputFolder, path.parse(filename).name, currentBitrateInKbps, mpdLocation)
                  if (error !== null) {
                      console.log('exec error: ' + error);
                  }
              });

          child

          }, {
              noAck: true
          });

    });
  });
}