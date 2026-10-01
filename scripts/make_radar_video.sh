#!/bin/bash
set -e

mkdir -p public/videos
FONT="/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"

echo "Rendering Scene 1: Space tracks Bangladesh's shifting rivers..."
ffmpeg -y -f lavfi -i "color=c=0x020510:s=1280x720:d=2.5:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='Space tracks Bangladesh\'s shifting rivers.':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=12,drawtext=fontfile=${FONT}:text='ORBITAL EARTH RECONNAISSANCE · 747 KM':x=48:y=40:fontsize=18:fontcolor=0x38bdf8:box=1:boxcolor=0x00000099:boxborderw=8,drawtext=fontfile=${FONT}:text='TARGET: 23.8° N 90.4° E [BENGAL BASIN]':x=w-tw-48:y=40:fontsize=16:fontcolor=0x22d3ee:box=1:boxcolor=0x00000099:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s1.mp4

echo "Rendering Scene 2: Radar penetrates clouds to map erosion..."
ffmpeg -y -f lavfi -i "color=c=0x061826:s=1280x720:d=3.0:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='Radar penetrates clouds to map erosion.':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=12,drawtext=fontfile=${FONT}:text='SAR MICROWAVE PENETRATING MONSOON CLOUD COVER':x=48:y=40:fontsize=18:fontcolor=0x22d3ee:box=1:boxcolor=0x00000099:boxborderw=8,drawtext=fontfile=${FONT}:text='L-BAND (24 cm) + C-BAND (5.6 cm) DUAL BEAM':x=w-tw-48:y=40:fontsize=16:fontcolor=0x38bdf8:box=1:boxcolor=0x00000099:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s2.mp4

echo "Rendering Scene 3: New chars emerge as vegetation takes root..."
ffmpeg -y -f lavfi -i "color=c=0x08201a:s=1280x720:d=2.5:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='New chars emerge as vegetation takes root.':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=12,drawtext=fontfile=${FONT}:text='BRAIDED CHANNEL RADAR BACKSCATTER · JAMUNA':x=48:y=40:fontsize=18:fontcolor=0x34d399:box=1:boxcolor=0x00000099:boxborderw=8,drawtext=fontfile=${FONT}:text='VEGETATION PIONEER INDEX: +34% HIGH CONFIDENCE':x=w-tw-48:y=40:fontsize=16:fontcolor=0x10b981:box=1:boxcolor=0x00000099:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s3.mp4

echo "Rendering Scene 4: This empowers communities to prepare..."
ffmpeg -y -f lavfi -i "color=c=0x121422:s=1280x720:d=2.5:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='This empowers communities to prepare.':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=12,drawtext=fontfile=${FONT}:text='COMMUNITY EMBANKMENT RISK FORECAST':x=48:y=40:fontsize=18:fontcolor=0xf59e0b:box=1:boxcolor=0x00000099:boxborderw=8,drawtext=fontfile=${FONT}:text='[ADVISORY]  [WARNING]  [CRITICAL: 120 HOMESTEADS]':x=w-tw-48:y=40:fontsize=16:fontcolor=0xef4444:box=1:boxcolor=0x00000099:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s4.mp4

echo "Concatenating scenes..."
cat << 'EOF' > /tmp/concat_list.txt
file '/tmp/s1.mp4'
file '/tmp/s2.mp4'
file '/tmp/s3.mp4'
file '/tmp/s4.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i /tmp/concat_list.txt -c copy public/videos/radar_mission.mp4
echo "Video created successfully at public/videos/radar_mission.mp4"
rm -f /tmp/s1.mp4 /tmp/s2.mp4 /tmp/s3.mp4 /tmp/s4.mp4 /tmp/concat_list.txt s1.mp4
