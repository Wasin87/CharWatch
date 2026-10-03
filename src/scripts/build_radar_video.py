import math
import subprocess
import os

width = 1280
height = 720
fps = 24
total_frames = 240 # 10 seconds

output_dir = "public/videos"
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "radar_mission.mp4")

# Command to stream raw RGB24 frames directly into ffmpeg for H.264 MP4 encoding
cmd = [
    "ffmpeg", "-y",
    "-f", "rawvideo",
    "-vcodec", "rawvideo",
    "-s", f"{width}x{height}",
    "-pix_fmt", "rgb24",
    "-r", str(fps),
    "-i", "-",
    "-vf", (
        "drawtext=fontfile=/usr/share/fonts/truetype/freefont/FreeSansBold.ttf:"
        "text='RIVERGUARD ORBITAL RADAR OBSERVATION | DUAL-FREQUENCY L+C BAND SAR':"
        "x=48:y=40:fontsize=20:fontcolor=0x22d3ee:box=1:boxcolor=0x00000099:boxborderw=8,"
        
        "drawtext=fontfile=/usr/share/fonts/truetype/freefont/FreeSansBold.ttf:"
        "text='LIVE SAR MICROWAVE TELEMETRY':"
        "x=w-tw-48:y=40:fontsize=18:fontcolor=0x38bdf8:box=1:boxcolor=0x00000099:boxborderw=8,"
        
        # Subtitle Scene 1 (0 to 2.5s)
        "drawtext=fontfile=/usr/share/fonts/truetype/freefont/FreeSansBold.ttf:"
        "text='Space tracks Bangladesh\\'s shifting rivers.':"
        "enable='between(t\\,0\\,2.5)':"
        "x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=14,"

        # Subtitle Scene 2 (2.5 to 5.4s)
        "drawtext=fontfile=/usr/share/fonts/truetype/freefont/FreeSansBold.ttf:"
        "text='Radar penetrates clouds to map erosion.':"
        "enable='between(t\\,2.5\\,5.4)':"
        "x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=14,"

        # Subtitle Scene 3 (5.4 to 7.9s)
        "drawtext=fontfile=/usr/share/fonts/truetype/freefont/FreeSansBold.ttf:"
        "text='New chars emerge as vegetation takes root.':"
        "enable='between(t\\,5.4\\,7.9)':"
        "x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=14,"

        # Subtitle Scene 4 (7.9 to 10s)
        "drawtext=fontfile=/usr/share/fonts/truetype/freefont/FreeSansBold.ttf:"
        "text='This empowers communities to prepare.':"
        "enable='between(t\\,7.9\\,10.0)':"
        "x=(w-tw)/2:y=h-80:fontsize=32:fontcolor=white:box=1:boxcolor=0x020617ee:boxborderw=14"
    ),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "ultrafast",
    "-crf", "23",
    output_path
]

process = subprocess.Popen(cmd, stdin=subprocess.PIPE)

import random
random.seed(42)
stars = [(random.randint(0, width - 1), random.randint(0, height - 1), random.randint(180, 255)) for _ in range(160)]

for frame_idx in range(total_frames):
    t = frame_idx / fps # seconds from 0.0 to 10.0
    buffer = bytearray(width * height * 3)

    if t < 2.5:
        # SCENE 1: Rotating 3D Blue Earth zooming into Bangladesh
        progress = t / 2.5
        zoom = 1.0 + progress * 0.9
        earth_r = int(180 * zoom)
        ecx = width // 2
        ecy = height // 2
        rot_angle = t * 0.9

        for sx, sy, sb in stars:
            idx = (sy * width + sx) * 3
            buffer[idx] = sb // 3
            buffer[idx + 1] = sb // 2
            buffer[idx + 2] = sb

        y_min = max(0, ecy - earth_r - 20)
        y_max = min(height, ecy + earth_r + 20)
        for y in range(y_min, y_max, 2):
            dy = y - ecy
            for x in range(ecx - earth_r - 20, ecx + earth_r + 20, 2):
                dx = x - ecx
                dist_sq = dx * dx + dy * dy
                dist = math.sqrt(dist_sq)

                if earth_r <= dist <= earth_r + 18:
                    alpha = (1.0 - (dist - earth_r) / 18.0) * 0.65
                    r_val = int(6 * alpha)
                    g_val = int(182 * alpha)
                    b_val = int(212 * alpha)
                    for ox in range(2):
                        for oy in range(2):
                            if x + ox < width and y + oy < height:
                                idx = ((y + oy) * width + (x + ox)) * 3
                                buffer[idx] = min(255, buffer[idx] + r_val)
                                buffer[idx + 1] = min(255, buffer[idx + 1] + g_val)
                                buffer[idx + 2] = min(255, buffer[idx + 2] + b_val)
                elif dist < earth_r:
                    nz = math.sqrt(max(0, 1.0 - (dx * dx + dy * dy) / (earth_r * earth_r)))
                    nx = dx / earth_r
                    ny = dy / earth_r
                    sun_dot = max(0.08, nx * -0.55 + ny * -0.45 + nz * 0.70)
                    lng = math.atan2(dx, nz * earth_r) + rot_angle
                    lat = -dy / earth_r
                    is_land = (math.sin(lng * 4.0) * math.cos(lat * 3.5) > 0.15)
                    
                    if is_land:
                        r_col = int(32 * sun_dot)
                        g_col = int(110 * sun_dot)
                        b_col = int(68 * sun_dot)
                    else:
                        specular = math.pow(max(0.0, sun_dot), 12) * 120
                        r_col = int(14 * sun_dot + specular * 0.5)
                        g_col = int(72 * sun_dot + specular * 0.8)
                        b_col = int(180 * sun_dot + specular)

                    for ox in range(2):
                        for oy in range(2):
                            if x + ox < width and y + oy < height:
                                idx = ((y + oy) * width + (x + ox)) * 3
                                buffer[idx] = min(255, r_col)
                                buffer[idx + 1] = min(255, g_col)
                                buffer[idx + 2] = min(255, b_col)

    elif t < 5.4:
        # SCENE 2: Satellite orbiting over clouds, radar beam penetrating storm clouds
        s2_t = t - 2.5
        beam_pulse = (s2_t * 3.5) % 1.0

        for y in range(height):
            base_g = 60 + int(30 * math.sin(y * 0.015))
            for x in range(width):
                idx = (y * width + x) * 3
                river_curve = 640 + int(180 * math.sin(y * 0.012 + 1.2))
                dist_to_river = abs(x - river_curve)

                if dist_to_river < 90:
                    r_val, g_val, b_val = 18, 55, 110
                else:
                    r_val, g_val, b_val = 35, base_g, 42

                cloud_noise = (math.sin(x * 0.018 + s2_t * 0.8) + math.cos(y * 0.025)) * 0.5 + 0.5
                if cloud_noise > 0.45:
                    cloud_alpha = min(0.85, (cloud_noise - 0.45) * 2.2)
                    r_val = int(r_val * (1 - cloud_alpha) + 220 * cloud_alpha)
                    g_val = int(g_val * (1 - cloud_alpha) + 235 * cloud_alpha)
                    b_val = int(b_val * (1 - cloud_alpha) + 245 * cloud_alpha)

                sat_x = int(320 + s2_t * 90)
                sat_y = 110
                dist_to_beam_center = math.hypot(x - sat_x, y - sat_y)

                if sat_y < y < 650:
                    beam_angle = math.atan2(x - sat_x, y - sat_y)
                    if abs(beam_angle) < 0.48:
                        radar_glow = (1.0 - abs(beam_angle) / 0.48) * 0.5
                        r_val = min(255, int(r_val + 20 * radar_glow))
                        g_val = min(255, int(g_val + 180 * radar_glow))
                        b_val = min(255, int(b_val + 220 * radar_glow))

                        wave_dist = (dist_to_beam_center - beam_pulse * 600) % 120
                        if abs(wave_dist) < 8:
                            r_val = min(255, r_val + 60)
                            g_val = min(255, g_val + 240)
                            b_val = min(255, b_val + 255)

                buffer[idx] = r_val
                buffer[idx + 1] = g_val
                buffer[idx + 2] = b_val

    elif t < 7.9:
        # SCENE 3: High-resolution radar satellite image of new chars emerging
        s3_t = t - 5.4
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 3
                meander_1 = 480 + int(140 * math.sin(y * 0.011))
                meander_2 = 820 + int(160 * math.cos(y * 0.009 + 0.8))
                dist_m1 = abs(x - meander_1)
                dist_m2 = abs(x - meander_2)

                char_cx = 640
                char_cy = 360
                char_dist = ((x - char_cx) / 130)**2 + ((y - char_cy) / 80)**2

                if char_dist < 1.0:
                    veg_growth = min(1.0, s3_t * 0.45)
                    r_val = int(210 * (1 - veg_growth) + 40 * veg_growth)
                    g_val = int(190 * (1 - veg_growth) + 160 * veg_growth)
                    b_val = int(140 * (1 - veg_growth) + 60 * veg_growth)
                    if 0.92 < char_dist < 0.99:
                        r_val, g_val, b_val = 34, 211, 238
                elif dist_m1 < 80 or dist_m2 < 90:
                    r_val, g_val, b_val = 15, 38, 64
                else:
                    r_val, g_val, b_val = 45, 95, 60

                if (y + int(s3_t * 120)) % 60 < 2:
                    r_val = min(255, r_val + 30)
                    g_val = min(255, g_val + 120)
                    b_val = min(255, b_val + 140)

                buffer[idx] = r_val
                buffer[idx + 1] = g_val
                buffer[idx + 2] = b_val

    else:
        # SCENE 4: Riverbank community with telemetry HUD
        s4_t = t - 7.9
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 3
                embankment_x = 540 + int(35 * math.sin(y * 0.02))
                
                if x < embankment_x:
                    flow = math.sin((x * 0.04) + (y * 0.03) + s4_t * 4.0) * 15
                    r_val = int(18 + flow * 0.3)
                    g_val = int(60 + flow * 0.6)
                    b_val = int(105 + flow)
                else:
                    field_pat = ((x // 60) + (y // 60)) % 2
                    if field_pat == 0:
                        r_val, g_val, b_val = 48, 125, 62
                    else:
                        r_val, g_val, b_val = 65, 140, 75

                    if embankment_x <= x <= embankment_x + 60:
                        pulse = (math.sin(s4_t * 6.0) + 1.0) * 0.5
                        r_val = min(255, int(r_val + 160 * pulse))
                        g_val = int(g_val * (1 - 0.5 * pulse))
                        b_val = int(b_val * (1 - 0.5 * pulse))

                if (abs(x - 420) < 1 or abs(y - 280) < 1) and (abs(x - 420) < 40 or abs(y - 280) < 40):
                    r_val, g_val, b_val = 6, 182, 212

                buffer[idx] = r_val
                buffer[idx + 1] = g_val
                buffer[idx + 2] = b_val

    process.stdin.write(buffer)

process.stdin.close()
process.wait()
print("Success! Radar mission video created at:", output_path)
