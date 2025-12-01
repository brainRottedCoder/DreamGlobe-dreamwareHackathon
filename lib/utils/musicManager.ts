// Background Music Manager for Dream Globe
// Handles all background music playback throughout the journey

export interface MusicTrack {
  path: string;
  name: string;
  loop?: boolean;
}

// Journey music - plays after "Start Your Journey" button
export const JOURNEY_MUSIC: MusicTrack[] = [
  {
    path: '/bgmusics/bgmusic1forplayedafterstartyourjourney.opus',
    name: 'Life Could Be a Dream',
    loop: false
  },
  {
    path: '/bgmusics/bgmusic2after1stone.opus',
    name: 'Background Music 2',
    loop: false
  }
];

// Ending music - plays when user ends journey
export const ENDING_MUSIC: MusicTrack = {
  path: '/bgmusics/endinggoodbye_opt.opus',
  name: 'Goodbye',
  loop: false
};

// Country-specific music - loops when at country's airport
// Each country can have multiple tracks that alternate
export const COUNTRY_MUSIC: Record<string, MusicTrack[]> = {
  india: [
    {
      path: '/bgmusics/india_bg.mp3', // NOTE: This file needs to be added to /public/bgmusics/
      name: 'India Theme',
      loop: true
    }
  ],
  usa: [
    {
      path: '/bgmusics/us_bg_music_opt.opus',
      name: 'USA Theme 1',
      loop: true
    },
    {
      path: '/bgmusics/USAmusic_opt.opus',
      name: 'USA Theme 2',
      loop: true
    }
  ],
  france: [
    {
      path: '/bgmusics/frenchbgmusic_opt.opus',
      name: 'France Theme 1',
      loop: true
    },
    {
      path: '/bgmusics/French_Music_opt.opus',
      name: 'France Theme 2',
      loop: true
    }
  ],
  russia: [
    {
      path: '/bgmusics/Russian Folk music_opt.opus',
      name: 'Russian Folk Music',
      loop: true
    }
  ],
  uk: [
    {
      path: '/bgmusics/uk_background_music_opt.opus',
      name: 'UK Theme',
      loop: true
    }
  ],
  'united-kingdom': [
    {
      path: '/bgmusics/uk_background_music_opt.opus',
      name: 'UK Theme',
      loop: true
    }
  ],
  'united-states': [
    {
      path: '/bgmusics/us_bg_music_opt.opus',
      name: 'USA Theme 1',
      loop: true
    },
    {
      path: '/bgmusics/USAmusic_opt.opus',
      name: 'USA Theme 2',
      loop: true
    }
  ]
};

class MusicManager {
  private currentAudio: HTMLAudioElement | null = null;
  private journeyPlaylist: MusicTrack[] = [...JOURNEY_MUSIC];
  private currentJourneyIndex: number = 0;
  private isPlayingJourney: boolean = false;
  private volume: number = 0.3; // Lowered from 0.5 to not overpower narration
  private pendingPlay: (() => void) | null = null;
  private userInteractionEnabled: boolean = false;

  constructor() {
    // Shuffle journey playlist for random order (except first track)
    if (this.journeyPlaylist.length > 1) {
      const firstTrack = this.journeyPlaylist[0];
      const remainingTracks = this.journeyPlaylist.slice(1);

      // Fisher-Yates shuffle
      for (let i = remainingTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingTracks[i], remainingTracks[j]] = [remainingTracks[j], remainingTracks[i]];
      }

      this.journeyPlaylist = [firstTrack, ...remainingTracks];
    }

    // Set up user interaction listener for autoplay
    this.enableUserInteraction();
  }

  private enableUserInteraction(): void {
    if (typeof window === 'undefined') return;

    const enableAutoplay = () => {
      this.userInteractionEnabled = true;
      console.log('🎵 User interaction detected - autoplay enabled');

      // Play pending audio if any
      if (this.pendingPlay) {
        console.log('🎵 Playing pending audio...');
        this.pendingPlay();
        this.pendingPlay = null;
      }
    };

    // Listen for various user interactions
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, enableAutoplay, { once: true });
    });
  }

  // Start playing journey music after "Start Your Journey" button
  playJourneyMusic(): void {
    console.log('🎵 Starting journey music...');
    this.isPlayingJourney = true;
    this.currentJourneyIndex = 0;
    this.playJourneyTrack();
  }

  private playJourneyTrack(): void {
    if (!this.isPlayingJourney || this.currentJourneyIndex >= this.journeyPlaylist.length) {
      // Loop back to second track (skip first "Life Could Be a Dream" after first play)
      if (this.isPlayingJourney && this.journeyPlaylist.length > 1) {
        console.log('🎵 Looping back to track 2...');
        this.currentJourneyIndex = 1;
        this.playJourneyTrack();
      }
      return;
    }

    const track = this.journeyPlaylist[this.currentJourneyIndex];
    console.log(`🎵 Playing journey track ${this.currentJourneyIndex + 1}: ${track.name} (${track.path})`);
    this.stopCurrent();

    this.currentAudio = new Audio(track.path);
    this.currentAudio.volume = this.volume;

    // When track ends, play next track
    this.currentAudio.addEventListener('ended', () => {
      console.log(`🎵 Track ended: ${track.name}`);
      this.currentJourneyIndex++;
      this.playJourneyTrack();
    });

    // Add error handling
    this.currentAudio.addEventListener('error', (e) => {
      console.error('🎵 Audio error:', e);
      console.error('🎵 Failed to load:', track.path);
    });

    this.currentAudio.play().catch(error => {
      console.error('🎵 Failed to play journey music:', error);
      console.error('🎵 Track path:', track.path);

      // If autoplay is blocked, set up pending play for next user interaction
      if (error.name === 'NotAllowedError') {
        console.log('🎵 Autoplay blocked - will play on next user interaction');
        this.pendingPlay = () => {
          if (this.currentAudio) {
            this.currentAudio.play().catch(e => console.error('🎵 Retry failed:', e));
          }
        };
      }
    });
  }

  // Play country-specific music when arriving at airport
  playCountryMusic(countryId: string): void {
    console.log(`🎵 Playing country music for: ${countryId}`);
    this.isPlayingJourney = false;
    const tracks = COUNTRY_MUSIC[countryId.toLowerCase()];

    if (!tracks || tracks.length === 0) {
      console.warn(`🎵 No music found for country: ${countryId}`);
      return;
    }

    // Randomly select one track if multiple are available
    const track = tracks[Math.floor(Math.random() * tracks.length)];

    console.log(`🎵 Loading country track: ${track.name} (${track.path})`);
    this.stopCurrent();

    this.currentAudio = new Audio(track.path);
    this.currentAudio.volume = this.volume;
    this.currentAudio.loop = track.loop || false;

    // Add error handling
    this.currentAudio.addEventListener('error', (e) => {
      console.error('🎵 Audio error:', e);
      console.error('🎵 Failed to load:', track.path);
    });

    this.currentAudio.play().catch(error => {
      console.error('🎵 Failed to play country music:', error);
      console.error('🎵 Track path:', track.path);

      // If autoplay is blocked, set up pending play for next user interaction
      if (error.name === 'NotAllowedError') {
        console.log('🎵 Autoplay blocked - will play on next user interaction');
        this.pendingPlay = () => {
          if (this.currentAudio) {
            this.currentAudio.play().catch(e => console.error('🎵 Retry failed:', e));
          }
        };
      }
    });
  }

  // Play ending music and show goodbye page
  playEndingMusic(): void {
    console.log('🎵 Playing ending music...');
    this.isPlayingJourney = false;
    this.stopCurrent();

    console.log(`🎵 Loading ending track: ${ENDING_MUSIC.name} (${ENDING_MUSIC.path})`);
    this.currentAudio = new Audio(ENDING_MUSIC.path);
    this.currentAudio.volume = this.volume;
    this.currentAudio.loop = false;

    // Add error handling
    this.currentAudio.addEventListener('error', (e) => {
      console.error('🎵 Audio error:', e);
      console.error('🎵 Failed to load:', ENDING_MUSIC.path);
    });

    this.currentAudio.play().catch(error => {
      console.error('🎵 Failed to play ending music:', error);
      console.error('🎵 Track path:', ENDING_MUSIC.path);
    });
  }

  // Stop current music
  stopCurrent(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  // Fade out current music
  fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      if (!this.currentAudio) {
        resolve();
        return;
      }

      const startVolume = this.currentAudio.volume;
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        if (this.currentAudio) {
          this.currentAudio.volume = Math.max(0, startVolume - (volumeStep * currentStep));
        }

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          this.stopCurrent();
          resolve();
        }
      }, stepDuration);
    });
  }

  // Set volume (0-1)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  // Get current volume
  getVolume(): number {
    return this.volume;
  }

  // Pause current music
  pause(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }

  // Resume current music
  resume(): void {
    if (this.currentAudio) {
      this.currentAudio.play().catch(error => {
        console.error('Failed to resume music:', error);
      });
    }
  }
}

// Singleton instance
let musicManagerInstance: MusicManager | null = null;

export function getMusicManager(): MusicManager {
  if (typeof window === 'undefined') {
    // Server-side, return a mock
    return {} as MusicManager;
  }

  if (!musicManagerInstance) {
    musicManagerInstance = new MusicManager();
  }

  return musicManagerInstance;
}

export default MusicManager;
