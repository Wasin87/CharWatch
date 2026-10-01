#!/bin/bash
set -e

mkdir -p public/videos
FONT="/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"

# Scene 1: Orbit Earth View (0 - 2.5s)
ffmpeg -y -f lavfi -i "color=c=0x030814:s=1280x720:d=2.5:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='Space tracks Bangladesh shifting rivers':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12,drawtext=fontfile=${FONT}:text='ORBITAL EARTH RECONNAISSANCE 747 KM':x=48:y=40:fontsize=18:fontcolor=0x38bdf8:box=1:boxcolor=black@0.6:boxborderw=8,drawtext=fontfile=${FONT}:text='BENGAL BASIN SATELLITE RADAR':x=w-tw-48:y=40:fontsize=16:fontcolor=0x22d3ee:box=1:boxcolor=black@0.6:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s1.mp4

# Scene 2: Radar Penetrating Clouds (2.5 - 5.5s)
ffmpeg -y -f lavfi -i "color=c=0x061a29:s=1280x720:d=3.0:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='Radar penetrates clouds to map erosion':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12,drawtext=fontfile=${FONT}:text='SAR MICROWAVE PENETRATES MONSOON CLOUDS':x=48:y=40:fontsize=18:fontcolor=0x22d3ee:box=1:boxcolor=black@0.6:boxborderw=8,drawtext=fontfile=${FONT}:text='DUAL FREQUENCY L-BAND AND C-BAND ACTIVE':x=w-tw-48:y=40:fontsize=16:fontcolor=0x38bdf8:box=1:boxcolor=black@0.6:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s2.mp4

# Scene 3: Chars Emerging (5.5 - 8.0s)
ffmpeg -y -f lavfi -i "color=c=0x06241a:s=1280x720:d=2.5:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='New chars emerge as vegetation takes root':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12,drawtext=fontfile=${FONT}:text='BRAIDED JAMUNA CHANNEL RADAR BACKSCATTER':x=48:y=40:fontsize=18:fontcolor=0x34d399:box=1:boxcolor=black@0.6:boxborderw=8,drawtext=fontfile=${FONT}:text='VEGETATION PIONEER INDEX PLUS 34 PERCENT':x=w-tw-48:y=40:fontsize=16:fontcolor=0x10b981:box=1:boxcolor=black@0.6:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s3.mp4

# Scene 4: Community Preparedness (8.0 - 10.5s)
ffmpeg -y -f lavfi -i "color=c=0x141824:s=1280x720:d=2.5:r=24" \
  -vf "drawtext=fontfile=${FONT}:text='This empowers communities to prepare':x=(w-tw)/2:y=h-90:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12,drawtext=fontfile=${FONT}:text='COMMUNITY EMBANKMENT RISK FORECAST':x=48:y=40:fontsize=18:fontcolor=0xf59e0b:box=1:boxcolor=black@0.6:boxborderw=8,drawtext=fontfile=${FONT}:text='ADVISORY WARNING CRITICAL RISK TIERS':x=w-tw-48:y=40:fontsize=16:fontcolor=0xef4444:box=1:boxcolor=black@0.6:boxborderw=8" \
  -c:v libx264 -pix_fmt yuv420p -preset ultrafast /tmp/s4.mp4

cat << 'EOF' > /tmp/concat_list.txt
file '/tmp/s1.mp4'
file '/tmp/s2.mp4'
file '/tmp/s3.mp4'
file '/tmp/s4.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i /tmp/concat_list.txt -c copy public/videos/radar_mission.mp4
rm -f /tmp/s1.mp4 /tmp/s2.mp4 /tmp/s3.mp4 /tmp/s4.mp4 /tmp/concat_list.txt
echo "Success! Video created at public/videos/radar_mission.mp4"
