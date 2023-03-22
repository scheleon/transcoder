# /bin/sh

if [ $# -lt 5 ]; then
        echo "USAGE: [script_name] [input_file] [output_directory] [output_file_name_prefix] [current_bitrate] [mpd_location]";
        exit 1;
fi

rm -rf ./scripts/cleaner.sh ./scripts/mpd_generator.sh

# First argument ==> location of the file
# Second argument  ==> ouput directory
# Third argument ==> output filename prefix
# Fourth argument ==> current Bitrate of input file
# Fifth argument ==> mpd location

videoFile=$1
outputDirectory=$2
outputFileNamePrefix=$3
currentBitrate=$4
mpdLocation=$5
currentDirectory=$6

# current bitrate (kb/s) of the video is the basis 
# to decide what the highest quality that the video can be
# transcoded in.

cd $currentDirectory
mkdir -p "$outputDirectory/$outputFileNamePrefix"
mkdir -p "$outputDirectory/$outputFileNamePrefix/video"
mkdir -p "$outputDirectory/$outputFileNamePrefix/audio"

outputDirectory="$outputDirectory/$outputFileNamePrefix"

echo '#!/bin/sh' > ./scripts/cleaner.sh

echo '#!/bin/sh' > ./scripts/mpd_generator.sh
echo './scripts/packager \' >> ./scripts/mpd_generator.sh

if [ $currentBitrate -gt 800 ]; then
	ffmpeg -y -i "$videoFile" -c:a aac -ac 2 -ab 256k -ar 48000 \
		-c:v libx264 -x264opts  'keyint=24:min-keyint=24:no-scenecut' \
		-b:v 1500k -maxrate 1500k -bufsize 1000k -vf "scale=-1:720" \
		"$outputDirectory/$outputFileNamePrefix-720p.mp4"
	
	echo "input=$outputDirectory/$outputFileNamePrefix-720p.mp4,stream=video,output=$outputDirectory/video/video720p.mp4 \\" >> ./scripts/mpd_generator.sh
	echo "input=$outputDirectory/$outputFileNamePrefix-720p.mp4,stream=audio,output=$outputDirectory/audio/audio720p.mp4 \\" >> ./scripts/mpd_generator.sh

	echo "rm -rf $outputDirectory/$outputFileNamePrefix-720p.mp4" >> ./scripts/cleaner.sh
fi

if [ $currentBitrate -gt 400 ]; then
	ffmpeg -y -i "$videoFile" -c:a aac -ac 2 -ab 128k -ar 44100 \
		-c:v libx264 -x264opts  'keyint=24:min-keyint=24:no-scenecut' \
		-b:v 800k -maxrate 800k -bufsize 500k -vf "scale=-1:540" \
		"$outputDirectory/$outputFileNamePrefix-540p.mp4"

	echo "input=$outputDirectory/$outputFileNamePrefix-540p.mp4,stream=video,output=$outputDirectory/video/video540p.mp4 \\" >> ./scripts/mpd_generator.sh
	echo "input=$outputDirectory/$outputFileNamePrefix-540p.mp4,stream=audio,output=$outputDirectory/audio/audio540p.mp4 \\" >> ./scripts/mpd_generator.sh

	echo "rm -rf $outputDirectory/$outputFileNamePrefix-540p.mp4" >> ./scripts/cleaner.sh
fi

ffmpeg -y -i "$videoFile" -c:a aac -ac 2 -ab 64k -ar 22050 \
	-c:v libx264 -x264opts  'keyint=24:min-keyint=24:no-scenecut' \
	-b:v 400k -maxrate 400k -bufsize 400k -vf "scale=-1:360" \
	"$outputDirectory/$outputFileNamePrefix-360p.mp4"

echo "input=$outputDirectory/$outputFileNamePrefix-360p.mp4,stream=video,output=$outputDirectory/video/video360p.mp4 \\" >> ./scripts/mpd_generator.sh
echo "input=$outputDirectory/$outputFileNamePrefix-360p.mp4,stream=audio,output=$outputDirectory/audio/audio360p.mp4 \\" >> ./scripts/mpd_generator.sh

echo "rm -rf $outputDirectory/$outputFileNamePrefix-360p.mp4" >> ./scripts/cleaner.sh

echo '--profile on-demand \' >> ./scripts/mpd_generator.sh
echo "--mpd_output \"$mpdLocation/$outputFileNamePrefix-manifest-full.mpd\" \\"  >> ./scripts/mpd_generator.sh
echo '--min_buffer_time 3 \' >> ./scripts/mpd_generator.sh
echo '--segment_duration 3' >> ./scripts/mpd_generator.sh

chmod +x ./scripts/mpd_generator.sh
./scripts/mpd_generator.sh

chmod +x ./scripts/cleaner.sh
./scripts/cleaner.sh