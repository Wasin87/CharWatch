#!/bin/bash
set -e

FONT="/usr/share/fonts/truetype/freefont/FreeSansBold.ttf"
FRAMES_DIR="public/videos/frames"

echo "1. Encoding Scene 1 (Earth Orbit Zoom)..."
ffmpeg -y -loop 1 -i "${FRAMES_DIR}/scene1.jpg" \
  -filter_complex "scale=5504:3072,zoompan=z='min(zoom+0.0018,1.22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=96:s=1280x720:fps=30,drawtext=fontfile=${FONT}:text='Space tracks Bangladesh\'s shifting rivers.':x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12" \
  -t 3.2 -c:v libx264 -pix_fmt yuv420p -r 30 -g 30 -preset ultrafast /tmp/c1.mp4

echo "2. Encoding Scene 2 (Radar Penetrates Clouds)..."
ffmpeg -y -loop 1 -i "${FRAMES_DIR}/scene2.jpg" \
  -filter_complex "scale=5504:3072,zoompan=z='1.16':x='(iw-iw/zoom)*(0.2+0.6*(on/96))':y='(ih-ih/zoom)*(0.2+0.5*(on/96))':d=96:s=1280x720:fps=30,drawtext=fontfile=${FONT}:text='Radar penetrates clouds to map erosion.':x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12" \
  -t 3.2 -c:v libx264 -pix_fmt yuv420p -r 30 -g 30 -preset ultrafast /tmp/c2.mp4

echo "3. Encoding Scene 3 (New Chars & Pioneer Vegetation)..."
ffmpeg -y -loop 1 -i "${FRAMES_DIR}/scene3.jpg" \
  -filter_complex "scale=5504:3072,zoompan=z='min(zoom+0.0014,1.16)':x='(iw-iw/zoom)*(0.75-0.5*(on/96))':y='ih/2-(ih/zoom/2)':d=96:s=1280x720:fps=30,drawtext=fontfile=${FONT}:text='New chars emerge as vegetation takes root.':x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12" \
  -t 3.2 -c:v libx264 -pix_fmt yuv420p -r 30 -g 30 -preset ultrafast /tmp/c3.mp4

echo "4. Encoding Scene 4 (Embankment Early Warning)..."
ffmpeg -y -loop 1 -i "${FRAMES_DIR}/scene4.jpg" \
  -filter_complex "scale=5504:3072,zoompan=z='min(zoom+0.0016,1.20)':x='(iw-iw/zoom)*0.55':y='(ih-ih/zoom)*(0.35+0.3*(on/96))':d=96:s=1280x720:fps=30,drawtext=fontfile=${FONT}:text='This empowers communities to prepare.':x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12" \
  -t 3.2 -c:v libx264 -pix_fmt yuv420p -r 30 -g 30 -preset ultrafast /tmp/c4.mp4

echo "5. Encoding Scene 5 (Jamuna River Basin Panorama)..."
ffmpeg -y -loop 1 -i "${FRAMES_DIR}/scene5.jpg" \
  -filter_complex "scale=5504:3072,zoompan=z='max(1.18-0.0016*on,1.02)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=96:s=1280x720:fps=30,drawtext=fontfile=${FONT}:text='RiverGuard Satellite Radar Observatory · Bangladesh':x=(w-tw)/2:y=h-80:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.75:boxborderw=12" \
  -t 3.2 -c:v libx264 -pix_fmt yuv420p -r 30 -g 30 -preset ultrafast /tmp/c5.mp4

echo "6. Seamless Crossfade Compositing into public/videos/radar_mission.mp4..."
ffmpeg -y -i /tmp/c1.mp4 -i /tmp/c2.mp4 -i /tmp/c3.mp4 -i /tmp/c4.mp4 -i /tmp/c5.mp4 \
  -filter_complex "
    [0:v][1:v]xfade=transition=fade:duration=0.5:offset=2.7[v01];
    [v01][2:v]xfade=transition=fade:duration=0.5:offset=5.4[v02];
    [v02][3:v]xfade=transition=fade:duration=0.5:offset=8.1[v03];
    [v03][4:v]xfade=transition=fade:duration=0.5:offset=10.8[v04]
  " \
  -map "[v04]" -c:v libx264 -pix_fmt yuv420p -r 30 -g 30 -crf 20 -movflags +faststart public/videos/radar_mission.mp4

mkdir -p dist/videos
cp public/videos/radar_mission.mp4 dist/videos/radar_mission.mp4

rm -f /tmp/c1.mp4 /tmp/c2.mp4 /tmp/c3.mp4 /tmp/c4.mp4 /tmp/c5.mp4
echo "Done! Ultra-smooth 30fps continuous motion radar mission video created at public/videos/radar_mission.mp4"
