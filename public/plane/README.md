# Transition Video Files

This directory contains POV (Point of View) taxi ride videos used for transitions between destinations in your dream journey.

## Required Video Files

Please upload the following 5 video files to this directory (`public/plane/`):

1. **British_City_Taxi_POV_opt_opt.mp4** - United Kingdom taxi ride
2. **Indian_City_Taxi_POV_Video_opt_opt.mp4** - India taxi ride
3. **Parisian_Taxi_Ride_POV_opt_opt.mp4** - France taxi ride
4. **Russian_City_Taxi_POV_opt_opt.mp4** - Russia taxi ride
5. **Taxi_POV_City_Drive_opt_opt.mp4** - United States taxi ride

## How to Upload

### From Your Local Machine (Windows):

Copy the video files from your local directory:
```
C:\Users\Abhi7\OneDrive\Desktop\demodream3\public\plane\
```

To the server location:
```
/home/user/demodream3/public/plane/
```

### Using Git:

```bash
# From your Windows machine, navigate to your project
cd C:\Users\Abhi7\OneDrive\Desktop\demodream3

# Add the video files
git add public/plane/*.mp4

# Commit
git commit -m "Add POV taxi transition videos"

# Push to your repository
git push
```

### Using SCP (Secure Copy):

```bash
scp C:\Users\Abhi7\OneDrive\Desktop\demodream3\public\plane\*.mp4 user@server:/home/user/demodream3/public/plane/
```

## Video Specifications

- **Format**: MP4 (H.264)
- **Resolution**: Optimized for web (recommend 1080p or 720p)
- **File naming**: Must match exactly as listed above
- **Purpose**: These videos play with eye-opening/closing transitions when traveling between destinations

## How They're Used

When users navigate between destinations (e.g., from Taj Mahal to Red Fort), the app:
1. Shows an eye-closing animation
2. Plays the appropriate POV taxi video for that country
3. Shows an eye-opening animation
4. Arrives at the new destination

This creates an immersive "dream glimpse" experience.

## Troubleshooting

If videos don't play:
- Verify file names match exactly (case-sensitive)
- Ensure files are in MP4 format
- Check file permissions: `chmod 644 *.mp4`
- Clear browser cache and reload

## File Size Optimization

To optimize video files for web delivery:

```bash
# Using ffmpeg (if available)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output_opt.mp4
```

The `_opt_opt` suffix suggests these files are already optimized.
