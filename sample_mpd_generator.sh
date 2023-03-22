#!/bin/sh
/home/scheleon/node-course/transcode/scripts/packager \
input=/sample-720p.mp4,stream=video,output=/video720p.mp4 \
input=/sample-720p.mp4,stream=audio,output=/audio720p.mp4 \
input=/sample-540p.mp4,stream=video,output=/video540p.mp4 \
input=/sample-540p.mp4,stream=audio,output=/audio540p.mp4 \
input=/sample-360p.mp4,stream=video,output=/video360p.mp4 \
input=/sample-360p.mp4,stream=audio,output=/audio360p.mp4 \
--profile on-demand \
--min_buffer_time 3 \
--segment_duration 3
